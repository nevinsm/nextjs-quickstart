import { createClient } from '@supabase/supabase-js';

import { env } from '@/env';

export const createServerClient = () =>
  createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      // Server components should not persist or auto-refresh sessions.
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
