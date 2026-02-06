import { redirect } from 'next/navigation';

import { ProjectsDashboard } from '@/features/projects/projects-dashboard';
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
      <ProjectsDashboard />
    </main>
  );
}
