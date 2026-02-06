'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { createBrowserClient } from '@/lib/supabase/browser-client';

export function SignOutButton() {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [isPending, setIsPending] = useState(false);

  const handleSignOut = async () => {
    setIsPending(true);

    await supabase.auth.signOut();
    await fetch('/auth/session', {
      method: 'DELETE',
    });

    router.push('/auth/sign-in');
    router.refresh();
  };

  return (
    <Button variant="outline" size="sm" onClick={handleSignOut} disabled={isPending}>
      {isPending ? 'Signing out...' : 'Sign out'}
    </Button>
  );
}
