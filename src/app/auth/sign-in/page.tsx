import Link from 'next/link';
import { redirect } from 'next/navigation';

import { SignInForm } from '@/app/auth/sign-in/sign-in-form';
import { getSessionUser } from '@/lib/auth/session';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function SignInPage() {
  const user = await getSessionUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <main className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Use your email and password to access the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignInForm />
          <p className="text-sm text-muted-foreground">
            After sign-up, check your email if confirmation is required, then continue from{' '}
            <Link href="/auth/callback" className="font-medium text-primary hover:underline">
              auth callback
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
