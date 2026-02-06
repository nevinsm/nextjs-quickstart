import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const aiRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required.').max(8000, 'Prompt is too long.'),
  provider: z.enum(['openai', 'anthropic']).optional(),
  model: z.string().min(1).max(120).optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});

type RateLimitResult =
  | { allowed: true }
  | {
      allowed: false;
      retryAfterSeconds: number;
      error?: string;
    };

const rateLimitEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  SUPABASE_SECRET_KEY: z.string().min(1),
  AI_RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().int().positive().optional().default(60),
  AI_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().optional().default(10),
});

const rateLimitEventInsertSchema = z.object({
  id: z.number().int().nonnegative(),
  created_at: z.string(),
});

const rateLimitEventCountSchema = z.object({
  id: z.number().int().nonnegative(),
});

function resolveRateLimitIdentifier(request: Request) {
  const ipHeaderCandidates = [
    'x-real-ip',
    'cf-connecting-ip',
    'x-vercel-forwarded-for',
    'x-forwarded-for',
    'true-client-ip',
    'fastly-client-ip',
    'fly-client-ip',
    'x-client-ip',
  ];

  for (const headerName of ipHeaderCandidates) {
    const rawValue = request.headers.get(headerName);
    if (!rawValue) {
      continue;
    }

    const firstValue = rawValue.split(',')[0]?.trim();
    if (firstValue) {
      return firstValue;
    }
  }

  return 'anonymous';
}

async function checkRateLimitSupabase(request: Request): Promise<RateLimitResult> {
  const parsedEnv = rateLimitEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    AI_RATE_LIMIT_WINDOW_SECONDS: process.env.AI_RATE_LIMIT_WINDOW_SECONDS,
    AI_RATE_LIMIT_MAX_REQUESTS: process.env.AI_RATE_LIMIT_MAX_REQUESTS,
  });

  if (!parsedEnv.success) {
    console.error('Invalid AI rate limit environment variables:', parsedEnv.error.flatten());
    return {
      allowed: false,
      retryAfterSeconds: 60,
      error: 'Rate limiter is misconfigured.',
    };
  }

  const {
    NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SECRET_KEY,
    AI_RATE_LIMIT_WINDOW_SECONDS,
    AI_RATE_LIMIT_MAX_REQUESTS,
  } = parsedEnv.data;

  const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  const identifier = resolveRateLimitIdentifier(request);
  const now = new Date();
  const windowStart = new Date(now.getTime() - AI_RATE_LIMIT_WINDOW_SECONDS * 1000).toISOString();

  const { data: insertedEvent, error: insertError } = await supabase
    .from('ai_rate_limit_events')
    .insert({
      identifier,
    })
    .select('id,created_at')
    .single();

  if (insertError) {
    console.error('Failed to insert AI rate limit event:', insertError.message);
    return {
      allowed: false,
      retryAfterSeconds: 60,
      error: 'Rate limiter is unavailable.',
    };
  }

  const insertedParsed = rateLimitEventInsertSchema.safeParse(insertedEvent);
  if (!insertedParsed.success) {
    console.error('Unexpected AI rate limit insert response:', insertedParsed.error.flatten());
    return {
      allowed: false,
      retryAfterSeconds: 60,
      error: 'Rate limiter is unavailable.',
    };
  }

  const { data: countRows, error: countError } = await supabase
    .from('ai_rate_limit_events')
    .select('id')
    .eq('identifier', identifier)
    .gte('created_at', windowStart);

  if (countError || !countRows) {
    console.error('Failed to count AI rate limit events:', countError?.message);
    return {
      allowed: false,
      retryAfterSeconds: AI_RATE_LIMIT_WINDOW_SECONDS,
      error: 'Rate limiter is unavailable.',
    };
  }

  const countParsed = z.array(rateLimitEventCountSchema).safeParse(countRows);
  if (!countParsed.success) {
    console.error('Unexpected AI rate limit count response:', countParsed.error.flatten());
    return {
      allowed: false,
      retryAfterSeconds: AI_RATE_LIMIT_WINDOW_SECONDS,
      error: 'Rate limiter is unavailable.',
    };
  }

  const requestCount = countParsed.data.length;
  if (requestCount > AI_RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: AI_RATE_LIMIT_WINDOW_SECONDS,
      error: 'Rate limit exceeded. Please try again later.',
    };
  }

  return { allowed: true };
}

export async function POST(request: Request) {
  try {
    const rateLimit = await checkRateLimitSupabase(request);

    if (!rateLimit.allowed) {
      const statusCode = rateLimit.error === 'Rate limit exceeded. Please try again later.' ? 429 : 503;

      return NextResponse.json(
        {
          error: rateLimit.error ?? 'Rate limiter unavailable.',
          retryAfterSeconds: rateLimit.retryAfterSeconds,
        },
        {
          status: statusCode,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    const payload = await request.json().catch(() => null);
    const parsed = aiRequestSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid AI request payload.',
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    // Intentional hackathon scaffold: provider integration is not implemented in this route yet.
    return NextResponse.json(
      {
        ok: true,
        message: 'AI provider not configured. Connect OpenAI or Anthropic to enable completions.',
        request: {
          provider: parsed.data.provider ?? 'openai',
          model: parsed.data.model ?? 'unset',
          promptPreview: parsed.data.prompt.slice(0, 120),
        },
      },
      { status: 501 }
    );
  } catch (error) {
    console.error('AI route error:', error);

    return NextResponse.json(
      {
        error: 'Failed to process AI request.',
      },
      { status: 500 }
    );
  }
}
