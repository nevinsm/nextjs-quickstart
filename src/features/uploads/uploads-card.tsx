'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { uploadFile, type UploadActionState } from '@/features/uploads/actions';

const initialUploadActionState: UploadActionState = {
  error: null,
  publicUrl: null,
};

const UploadSubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Uploading...' : 'Upload file'}
    </Button>
  );
};

export const UploadsCard = () => {
  const [state, formAction] = useActionState(uploadFile, initialUploadActionState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload file</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <form action={formAction} className="space-y-3">
          <Input name="file" type="file" required />
          <UploadSubmitButton />
        </form>
        {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
        {state.publicUrl ? (
          <div className="space-y-1">
            <p className="text-sm font-medium">Uploaded file URL</p>
            <a
              href={state.publicUrl}
              target="_blank"
              rel="noreferrer"
              className="block break-all text-sm text-primary underline-offset-4 hover:underline"
            >
              {state.publicUrl}
            </a>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
