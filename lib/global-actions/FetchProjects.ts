'use server';

import { db } from '@/db';
import { projects } from '@/db/schema';
import { desc } from 'drizzle-orm';

export default async function FetchProjectsAction(
  limit: number,
  offset: number,
) {
  try {
    const result = await db
      .select()
      .from(projects)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(projects.displayIndex));
    return result;
  } catch (e) {
    console.log(e);
  }
}
