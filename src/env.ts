import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formatted = parsed.error.flatten().fieldErrors;
  console.error('Invalid environment variables:', formatted);
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;
