'use server';

import { db } from '@/db';
import { images, TImage } from '@/db/schema';
import { validateRequest } from '@/lib/auth';
import { generateIdFromEntropySize } from 'lucia';

export default async function ImageUploadAction({
  fileUrl,
  key,
  fileSize,
  fileName,
}: TImage) {
  const { user } = await validateRequest();
  if (!user?.role) return { ok: false, message: 'Unauthorized Action' };

  try {
    const id = generateIdFromEntropySize(10);
    await db.insert(images).values({ id, fileUrl, key, fileSize, fileName });
    return { ok: true, message: 'Insertion Succesful', fileUrl, id };
  } catch (error) {
    return { ok: false, message: 'An Error Occured' };
  }
}
