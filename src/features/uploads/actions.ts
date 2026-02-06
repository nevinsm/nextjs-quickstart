'use server';

import { z } from 'zod';

import { getSessionToken, getSessionUser } from '@/lib/auth/session';
import { createServerClient } from '@/lib/supabase/server-client';

const UPLOADS_BUCKET = 'uploads';
const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

const uploadMetadataSchema = z.object({
  fileName: z.string().min(1, 'Select a file to upload.'),
  fileSize: z
    .number()
    .int()
    .positive('Select a non-empty file.')
    .max(MAX_UPLOAD_SIZE_BYTES, 'File must be 5 MB or smaller.'),
  fileType: z.string(),
});

export type UploadActionState = {
  error: string | null;
  publicUrl: string | null;
};

const sanitizeFileName = (value: string) => value.replace(/[^a-zA-Z0-9._-]/g, '_');

export const uploadFile = async (
  _previousState: UploadActionState,
  formData: FormData
): Promise<UploadActionState> => {
  const user = await getSessionUser();
  const token = await getSessionToken();

  if (!user || !token) {
    return {
      error: 'You must be signed in to upload files.',
      publicUrl: null,
    };
  }

  const fileEntry = formData.get('file');

  if (!(fileEntry instanceof File)) {
    return {
      error: 'Select a file to upload.',
      publicUrl: null,
    };
  }

  const parsedMetadata = uploadMetadataSchema.safeParse({
    fileName: fileEntry.name,
    fileSize: fileEntry.size,
    fileType: fileEntry.type,
  });

  if (!parsedMetadata.success) {
    return {
      error: parsedMetadata.error.issues[0]?.message ?? 'Invalid file.',
      publicUrl: null,
    };
  }

  const supabase = createServerClient(token);
  const safeFileName = sanitizeFileName(parsedMetadata.data.fileName);
  const filePath = `${user.id}/${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;
  const { error: uploadError } = await supabase.storage.from(UPLOADS_BUCKET).upload(filePath, fileEntry, {
    upsert: false,
    contentType: parsedMetadata.data.fileType || undefined,
  });

  if (uploadError) {
    const isMissingBucket = uploadError.message.toLowerCase().includes('bucket not found');

    return {
      error: isMissingBucket
        ? 'Upload failed: Storage bucket "uploads" is missing. Apply migration 20260206124500_create_uploads_bucket.sql.'
        : `Upload failed: ${uploadError.message}`,
      publicUrl: null,
    };
  }

  const { data } = supabase.storage.from(UPLOADS_BUCKET).getPublicUrl(filePath);

  return {
    error: null,
    publicUrl: data.publicUrl,
  };
};
