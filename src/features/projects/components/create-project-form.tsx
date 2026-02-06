'use client';

import { Input } from '@/components/ui/input';
import { createProjectAction } from '@/features/projects/actions';
import { useProjectActionState } from '@/features/projects/hooks/use-project-action-state';

import { ProjectSubmitButton } from './project-submit-button';

export const CreateProjectForm = () => {
  const { state, formAction } = useProjectActionState(createProjectAction);

  return (
    <form action={formAction} className="space-y-3">
      <Input name="name" placeholder="Project name" required />
      {state.message ? (
        <p className={state.status === 'error' ? 'text-sm text-destructive' : 'text-sm text-emerald-600'}>
          {state.message}
        </p>
      ) : null}
      <ProjectSubmitButton idleLabel="Add project" pendingLabel="Adding project..." />
    </form>
  );
};
