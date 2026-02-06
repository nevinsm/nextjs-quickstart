'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createBrowserClient } from '@/lib/supabase/browser-client';

type AuthMode = 'sign-in' | 'sign-up';

const persistSession = async (accessToken: string, expiresAt?: number) => {
  await fetch('/auth/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ accessToken, expiresAt }),
  });
};

export function SignInForm() {
  const router = useRouter();
  const supabase = createBrowserClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeMode, setActiveMode] = useState<AuthMode | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const runAuth = async (mode: AuthMode) => {
    setActiveMode(mode);
    setMessage(null);

    const result =
      mode === 'sign-in'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });

    const { data, error } = result;

    if (error) {
      setMessage(error.message);
      setActiveMode(null);
      return;
    }

    if (!data.session) {
      setMessage('Sign-up successful. Check your email to confirm your account.');
      setActiveMode(null);
      return;
    }

    await persistSession(data.session.access_token, data.session.expires_at);
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 6 characters"
          minLength={6}
          required
        />
      </div>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          className="sm:flex-1"
          onClick={() => {
            void runAuth('sign-in');
          }}
          disabled={activeMode !== null}
        >
          {activeMode === 'sign-in' ? 'Signing in...' : 'Sign in'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="sm:flex-1"
          onClick={() => {
            void runAuth('sign-up');
          }}
          disabled={activeMode !== null}
        >
          {activeMode === 'sign-up' ? 'Creating account...' : 'Sign up'}
        </Button>
      </div>
    </form>
  );
}
