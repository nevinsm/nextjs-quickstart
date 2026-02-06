import { NextResponse } from 'next/server';
import { z } from 'zod';

import { clearSessionCookie, setSessionCookie } from '@/lib/auth/session';

const sessionPayloadSchema = z.object({
  accessToken: z.string().min(1),
  expiresAt: z.number().int().positive().optional(),
});

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = sessionPayloadSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid session payload.' }, { status: 400 });
  }

  await setSessionCookie(parsed.data);

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
