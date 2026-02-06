import Link from 'next/link';

import { SignOutButton } from '@/components/app-shell/sign-out-button';
import { Button } from '@/components/ui/button';
import { getSessionUser } from '@/lib/auth/session';

export async function AppHeader() {
  const user = await getSessionUser();

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-base font-semibold text-foreground">
            Hackathon Base
          </Link>
          <nav className="hidden items-center gap-4 text-sm text-muted-foreground md:flex">
            <Link href="/" className="transition-colors hover:text-foreground">
              Overview
            </Link>
            <Link href="/dashboard" className="transition-colors hover:text-foreground">
              Dashboard
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <p className="hidden text-sm text-muted-foreground sm:block">{user.email}</p>
              <SignOutButton />
            </>
          ) : (
            <Button asChild size="sm">
              <Link href="/auth/sign-in">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
