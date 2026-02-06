'use server';

import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

import { getSessionToken, getSessionUser } from '@/lib/auth/session';
import { createProjectRecord, deleteProjectRecord, updateProjectRecord } from '@/features/projects/data-access';
import type { ProjectFormState } from '@/features/projects/types';
import { createProjectSchema, deleteProjectSchema, updateProjectSchema } from '@/features/projects/validation';

const requireAuthenticatedSession = async (): Promise<{ token: string } | null> => {
  const user = await getSessionUser();
  const token = await getSessionToken();

  if (!user || !token) {
    return null;
  }

  return { token };
};

// Converts structured zod errors into a UI-friendly field/message shape.
const toInvalidPayloadState = (error: ZodError): ProjectFormState => {
  const flattened = error.flatten();

  return {
    status: 'error',
    message: flattened.formErrors[0] ?? 'Invalid input.',
    fieldErrors: {
      name: flattened.fieldErrors.name,
      id: flattened.fieldErrors.id,
    },
  };
};

const toGenericErrorState = (error: unknown): ProjectFormState => {
  if (error instanceof ZodError) {
    return toInvalidPayloadState(error);
  }

  return {
    status: 'error',
    message: error instanceof Error ? error.message : 'Action failed.',
    fieldErrors: {},
  };
};

export const createProjectAction = async (
  _previousState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> => {
  const session = await requireAuthenticatedSession();

  if (!session) {
    return {
      status: 'error',
      message: 'You must be signed in to create a project.',
      fieldErrors: {},
    };
  }

  try {
    // Parse and validate raw FormData before any persistence call.
    const parsed = createProjectSchema.parse({
      name: formData.get('name'),
    });

    await createProjectRecord(session.token, parsed);
    revalidatePath('/dashboard');

    return {
      status: 'success',
      message: 'Project created.',
      fieldErrors: {},
    };
  } catch (error) {
    return toGenericErrorState(error);
  }
};

export const updateProjectAction = async (
  _previousState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> => {
  const session = await requireAuthenticatedSession();

  if (!session) {
    return {
      status: 'error',
      message: 'You must be signed in to update a project.',
      fieldErrors: {},
    };
  }

  try {
    const parsed = updateProjectSchema.parse({
      id: formData.get('id'),
      name: formData.get('name'),
    });

    await updateProjectRecord(session.token, parsed);
    revalidatePath('/dashboard');

    return {
      status: 'success',
      message: 'Project updated.',
      fieldErrors: {},
    };
  } catch (error) {
    return toGenericErrorState(error);
  }
};

export const deleteProjectAction = async (
  _previousState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> => {
  const session = await requireAuthenticatedSession();

  if (!session) {
    return {
      status: 'error',
      message: 'You must be signed in to delete a project.',
      fieldErrors: {},
    };
  }

  try {
    const parsed = deleteProjectSchema.parse({
      id: formData.get('id'),
    });

    await deleteProjectRecord(session.token, parsed);
    revalidatePath('/dashboard');

    return {
      status: 'success',
      message: 'Project deleted.',
      fieldErrors: {},
    };
  } catch (error) {
    return toGenericErrorState(error);
  }
};
