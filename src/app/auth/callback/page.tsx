import { Suspense } from 'react';

import { CallbackContent } from '@/app/auth/callback/callback-content';

export default function AuthCallbackPage() {
  return (
    <main className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading callback...</p>}>
        <CallbackContent />
      </Suspense>
    </main>
  );
}
