import { createServerClient } from '@/lib/supabase/server-client';

import type { Project } from './types';
import type { CreateProjectInput, DeleteProjectInput, UpdateProjectInput } from './validation';

const projectSelect = 'id, name, created_at';

const getProjectsTable = (token: string) => createServerClient(token).from('projects');

const normalizeSupabaseError = (message: string, action: string) => {
  const lowerMessage = message.toLowerCase();

  if (
    action !== 'load' &&
    (lowerMessage.includes('permission denied') || lowerMessage.includes('row-level security'))
  ) {
    return 'This action is blocked by project table permissions. Add UPDATE/DELETE RLS policies for projects.';
  }

  return message;
};

export const listProjects = async (token: string): Promise<Project[]> => {
  const { data, error } = await getProjectsTable(token)
    .select(projectSelect)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to load projects: ${normalizeSupabaseError(error.message, 'load')}`);
  }

  return data ?? [];
};

export const createProjectRecord = async (token: string, input: CreateProjectInput): Promise<void> => {
  const { error } = await getProjectsTable(token).insert({ name: input.name });

  if (error) {
    throw new Error(`Failed to create project: ${normalizeSupabaseError(error.message, 'create')}`);
  }
};

export const updateProjectRecord = async (token: string, input: UpdateProjectInput): Promise<void> => {
  const { data, error } = await getProjectsTable(token)
    .update({ name: input.name })
    .eq('id', input.id)
    .select('id');

  if (error) {
    throw new Error(`Failed to update project: ${normalizeSupabaseError(error.message, 'update')}`);
  }

  if (!data || data.length === 0) {
    throw new Error(
      'Failed to update project: no rows were updated. Add an UPDATE RLS policy for table "projects".'
    );
  }
};

export const deleteProjectRecord = async (token: string, input: DeleteProjectInput): Promise<void> => {
  const { data, error } = await getProjectsTable(token).delete().eq('id', input.id).select('id');

  if (error) {
    throw new Error(`Failed to delete project: ${normalizeSupabaseError(error.message, 'delete')}`);
  }

  if (!data || data.length === 0) {
    throw new Error(
      'Failed to delete project: no rows were deleted. Add a DELETE RLS policy for table "projects".'
    );
  }
};
