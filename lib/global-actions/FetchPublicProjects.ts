'use server';

import { db } from '@/db';
import { projects } from '@/db/schema';
import { and, desc, eq, gte } from 'drizzle-orm';

export default async function FetchPublicProjectsAction(
  { minIndex } = { minIndex: 0 },
) {
  try {
    const data = await db
      .select({
        name: projects.projectName,
        summary: projects.summary,
        tags: projects.tags,
        demoLink: projects.demoLink,
        sourceLink: projects.sourceLink,
        index: projects.displayIndex,
        imageUrl: projects.imgUrl,
      })
      .from(projects)
      .where(
        and(eq(projects.enabled, true), gte(projects.displayIndex, minIndex)),
      )
      .orderBy(desc(projects.displayIndex));

    return { data };
  } catch (error) {
    console.log(error);
    return { data: undefined };
  }
}
