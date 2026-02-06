'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { createBrowserClient } from '@/lib/supabase/browser-client';

const persistSession = async (accessToken: string, expiresAt?: number) => {
  await fetch('/auth/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ accessToken, expiresAt }),
  });
};

export function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [status, setStatus] = useState('Completing authentication...');

  useEffect(() => {
    const run = async () => {
      const code = searchParams.get('code');

      // Supabase can also return an implicit flow payload in the URL hash.
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const hashAccessToken = hashParams.get('access_token');
      const hashExpiresAt = hashParams.get('expires_at');

      if (hashAccessToken) {
        await persistSession(
          hashAccessToken,
          hashExpiresAt ? Number.parseInt(hashExpiresAt, 10) : undefined,
        );
        router.replace('/dashboard');
        router.refresh();
        return;
      }

      if (!code) {
        setStatus('Missing callback code. Return to sign-in and try again.');
        return;
      }

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error || !data.session) {
        setStatus(error?.message ?? 'Unable to complete authentication.');
        return;
      }

      await persistSession(data.session.access_token, data.session.expires_at);
      router.replace('/dashboard');
      router.refresh();
    };

    void run();
  }, [router, searchParams, supabase]);

  return (
    <div className="space-y-3 text-center">
      <h1 className="text-2xl font-semibold">Auth callback</h1>
      <p className="text-sm text-muted-foreground">{status}</p>
      <p className="text-sm">
        <Link href="/auth/sign-in" className="font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
