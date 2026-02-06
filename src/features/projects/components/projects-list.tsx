'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { deleteProjectAction, updateProjectAction } from '@/features/projects/actions';
import { useProjectActionState } from '@/features/projects/hooks/use-project-action-state';
import type { Project } from '@/features/projects/types';

import { ProjectSubmitButton } from './project-submit-button';

type ProjectsListProps = {
  projects: Project[];
};

type ProjectItemProps = {
  project: Project;
};

const ProjectItem = ({ project }: ProjectItemProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { state: updateState, formAction: updateFormAction } = useProjectActionState(updateProjectAction, {
    onSuccess: () => setIsEditOpen(false),
  });
  const { state: deleteState, formAction: deleteFormAction } = useProjectActionState(deleteProjectAction);

  return (
    <li className="rounded-md border p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="font-medium">{project.name}</p>
          <p className="text-xs text-muted-foreground">Created {new Date(project.created_at).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit project</DialogTitle>
                <DialogDescription>Update your project name.</DialogDescription>
              </DialogHeader>
              <form action={updateFormAction} className="space-y-3">
                <input type="hidden" name="id" value={project.id} />
                <Input name="name" defaultValue={project.name} required />
                {updateState.message ? (
                  <p
                    className={updateState.status === 'error' ? 'text-sm text-destructive' : 'text-sm text-emerald-600'}
                  >
                    {updateState.message}
                  </p>
                ) : null}
                <DialogFooter>
                  <ProjectSubmitButton idleLabel="Save changes" pendingLabel="Saving..." />
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <form action={deleteFormAction}>
            <input type="hidden" name="id" value={project.id} />
            <ProjectSubmitButton
              idleLabel="Delete"
              pendingLabel="Deleting..."
              variant="destructive"
            />
          </form>
        </div>
      </div>
      {deleteState.status === 'error' && deleteState.message ? (
        <p className="mt-2 text-sm text-destructive">{deleteState.message}</p>
      ) : null}
    </li>
  );
};

export const ProjectsList = ({ projects }: ProjectsListProps) => {
  if (projects.length === 0) {
    return <p className="text-sm text-muted-foreground">No projects yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {projects.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}
    </ul>
  );
};
