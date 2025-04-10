'use server';

import { db } from '@/db';
import { projects } from '@/db/schema';
import { Redis } from '@upstash/redis';
import { and, desc, eq, gte } from 'drizzle-orm';
import { z } from 'zod';
import { redisKeys } from '../constants';

const ProjectDataSchema = z.object({
  name: z.string(),
  summary: z.string(),
  tags: z.array(z.string()).nullable(),
  demoLink: z.string(),
  sourceLink: z.string(),
  index: z.number(),
  imageUrl: z.string(),
});
const ProjectDataArraySchema = z.array(ProjectDataSchema);

export default async function FetchPublicProjectsAction(
  { minIndex } = { minIndex: 0 },
) {
  try {
    const redis = Redis.fromEnv();
    const cachedProjectsData = await redis.get(redisKeys.publicProjectsData);
    const validatedCache = ProjectDataArraySchema.safeParse(cachedProjectsData);

    if (validatedCache.success) return { data: validatedCache.data };

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

    try {
      redis.set(redisKeys.publicProjectsData, JSON.stringify(data));
    } catch (error) {
      return { data };
    }

    return { data };
  } catch (error) {
    console.log(error);
    return { data: undefined };
  }
}
