'use client';

import { useActionState, useEffect, useRef } from 'react';

import { initialProjectFormState, type ProjectFormState } from '@/features/projects/types';

type ProjectStateAction = (
  previousState: ProjectFormState,
  formData: FormData
) => Promise<ProjectFormState>;

type UseProjectActionStateOptions = {
  onSuccess?: () => void;
};

export const useProjectActionState = (
  action: ProjectStateAction,
  options: UseProjectActionStateOptions = {}
) => {
  const [state, formAction] = useActionState(action, initialProjectFormState);
  const { onSuccess } = options;
  const previousStatus = useRef<ProjectFormState['status']>('idle');

  useEffect(() => {
    const statusChanged = previousStatus.current !== state.status;
    previousStatus.current = state.status;

    if (!statusChanged) {
      return;
    }

    if (state.status === 'success') {
      onSuccess?.();
    }
  }, [state.status, onSuccess]);

  return {
    state,
    formAction,
  };
};
