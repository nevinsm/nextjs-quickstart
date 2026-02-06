import { redirect } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSessionUser } from '@/lib/auth/session';

export default async function DashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/auth/sign-in');
  }

  return (
    <main className="container space-y-6 py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Signed in as {user.email}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Live metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connect Supabase queries here and visualize your real-time data.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Next actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Drop in your roadmap, alerts, or handoff notes.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
