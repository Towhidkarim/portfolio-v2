'use server';

import { redirect } from 'next/navigation';
import { validateRequest } from '../auth';
import { routes } from '../constants';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';
type ModifiedValues = {
  enabled: boolean | undefined;
  projectName: string | undefined;
  imgUrl: string | undefined;
  tags: string[] | undefined;
  displayIndex: number | undefined;
  description: string | undefined;
  summary: string | undefined;
  demoLink: string | undefined;
  sourceLink: string | undefined;
};
export default async function ModifyProjectAction({
  id,
  values,
}: {
  id: string;
  values: ModifiedValues;
}) {
  const { user } = await validateRequest();
  if (user?.role !== 'admin') redirect(routes.login);

  try {
    await db.update(projects).set(values).where(eq(projects.id, id));
    return { ok: true, message: 'Changes Saved Succesfully' };
  } catch (error) {
    console.log(error);
    return { ok: false, message: 'Something Went Wrong' };
  }
}
