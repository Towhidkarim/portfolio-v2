'use server';

import { db } from '@/db';
import { projects, ProjectSchema } from '@/db/schema';
import { validateRequest } from '@/lib/auth';
import { routes } from '@/lib/constants';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { generateIdFromEntropySize } from 'lucia';

export default async function SubmitProjectAction({
  data,
}: {
  data: z.infer<typeof ProjectSchema>;
}) {
  const { user } = await validateRequest();

  if (user?.role !== 'admin') return redirect(routes.login);
  const dataIsValid = ProjectSchema.safeParse(data);

  if (!dataIsValid.success) return { ok: false, message: 'Invalid Data' };
  const {
    projectName,
    demoLink,
    description,
    imgID,
    imgUrl,
    displayIndex,
    sourceLink,
    tags,
    summary,
  } = dataIsValid.data;

  // const uploadResponse = await utapi.uploadFiles(imageFile);
  // if (uploadResponse.error) return { ok: false, error: uploadResponse.error };
  // const imgID = uploadResponse.data.customId;
  // const imgUrl = uploadResponse.data.url;

  try {
    await db.insert(projects).values({
      id: generateIdFromEntropySize(10),
      projectName,
      imgID: imgID ?? '',
      imgUrl: imgUrl ?? '',
      demoLink,
      description,
      displayIndex,
      enabled: true,
      sourceLink,
      summary,
      tags,
    });

    return { ok: true, message: 'Project Information Added Succesfully' };
  } catch (error) {
    console.log(error);
    return { ok: false, message: 'Something Went Wrong' };
  }
}
