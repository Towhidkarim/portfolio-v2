import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { getDb } from '../db.server';
import {
  getPublicProject,
  getPublicProjects,
} from '../queries/projects.server';

export const fetchPublicProjects = createServerFn({ method: 'GET' }).handler(
  () => getPublicProjects(getDb()),
);

export const fetchPublicProject = createServerFn({ method: 'GET' })
  .validator(z.object({ id: z.string().min(1) }))
  .handler(({ data }) => getPublicProject(getDb(), data.id));
