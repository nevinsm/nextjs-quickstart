import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createProject } from '@/features/projects/actions';
import { getSessionToken } from '@/lib/auth/session';
import { createServerClient } from '@/lib/supabase/server-client';

type Project = {
  id: string;
  name: string;
  created_at: string;
};

export async function ProjectsDashboard() {
  const token = await getSessionToken();

  if (!token) {
    return null;
  }

  const supabase = createServerClient(token);
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, name, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to load projects: ${error.message}`);
  }

  const projectRows = projects ?? [];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Create project</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createProject} className="space-y-3">
            <Input name="name" placeholder="Project name" required />
            <Button type="submit">
              Add project
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Your projects</CardTitle>
        </CardHeader>
        <CardContent>
          {projectRows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No projects yet.</p>
          ) : (
            <ul className="space-y-2">
              {projectRows.map((project: Project) => (
                <li key={project.id} className="rounded-md border p-3">
                  <p className="font-medium">{project.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Created {new Date(project.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
