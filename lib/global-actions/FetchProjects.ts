'use server';

import { db } from '@/db';
import { projects } from '@/db/schema';

export default async function FetchProjectsAction(
  limit: number,
  offset: number,
) {
  try {
    const result = await db.select().from(projects).limit(limit).offset(offset);
    return result;
  } catch (e) {
    console.log(e);
  }
}
