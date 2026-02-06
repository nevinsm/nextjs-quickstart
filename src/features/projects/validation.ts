import { z } from 'zod';

const projectIdSchema = z.string().uuid('Invalid project identifier.');
const projectNameSchema = z
  .string()
  .trim()
  .min(1, 'Project name is required.')
  .max(80, 'Project name must be 80 characters or fewer.');

export const createProjectSchema = z.object({
  name: projectNameSchema,
});

export const updateProjectSchema = z.object({
  id: projectIdSchema,
  name: projectNameSchema,
});

export const deleteProjectSchema = z.object({
  id: projectIdSchema,
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type DeleteProjectInput = z.infer<typeof deleteProjectSchema>;
