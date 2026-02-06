'use server';

import { revalidatePath } from 'next/cache';

import { getSessionToken, getSessionUser } from '@/lib/auth/session';
import { createServerClient } from '@/lib/supabase/server-client';

export const createProject = async (formData: FormData) => {
  const user = await getSessionUser();
  const token = await getSessionToken();

  if (!user || !token) {
    return;
  }

  const nameValue = formData.get('name');
  const name = typeof nameValue === 'string' ? nameValue.trim() : '';

  if (!name) {
    return;
  }

  const supabase = createServerClient(token);
  const { error } = await supabase.from('projects').insert({ name });

  if (error) {
    throw new Error(`Failed to create project: ${error.message}`);
  }

  revalidatePath('/dashboard');
};
