export type Project = {
  id: string;
  name: string;
  created_at: string;
};

export type ProjectFormState = {
  status: 'idle' | 'success' | 'error';
  message: string | null;
  fieldErrors: {
    name?: string[];
    id?: string[];
  };
};

export const initialProjectFormState: ProjectFormState = {
  status: 'idle',
  message: null,
  fieldErrors: {},
};
