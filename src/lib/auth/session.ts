import { cookies } from 'next/headers';

import { createServerClient } from '@/lib/supabase/server-client';

const SESSION_COOKIE_NAME = 'sb-access-token';
const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

type SessionCookieInput = {
  accessToken: string;
  expiresAt?: number;
};

const resolveCookieMaxAge = (expiresAt?: number) => {
  if (!expiresAt) {
    return ONE_WEEK_IN_SECONDS;
  }

  const secondsUntilExpiry = Math.max(expiresAt - Math.floor(Date.now() / 1000), 0);
  return secondsUntilExpiry;
};

export const setSessionCookie = async ({ accessToken, expiresAt }: SessionCookieInput) => {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: resolveCookieMaxAge(expiresAt),
  });
};

export const clearSessionCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
};

export const getSessionToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
};

export const getSessionUser = async () => {
  const token = await getSessionToken();

  if (!token) {
    return null;
  }

  const supabase = createServerClient(token);
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return data.user;
};
