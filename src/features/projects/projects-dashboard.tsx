import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateProjectForm } from '@/features/projects/components/create-project-form';
import { ProjectsList } from '@/features/projects/components/projects-list';
import { listProjects } from '@/features/projects/data-access';
import { getSessionToken } from '@/lib/auth/session';

export async function ProjectsDashboard() {
  const token = await getSessionToken();

  if (!token) {
    return null;
  }

  const projectRows = await listProjects(token);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Create project</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateProjectForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Your projects</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectsList projects={projectRows} />
        </CardContent>
      </Card>
    </div>
  );
}
