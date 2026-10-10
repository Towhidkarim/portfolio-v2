import { and, asc, desc, eq, like } from 'drizzle-orm';
import type { Db } from '@/db';
import { type NewProject, projects } from '@/db/schema';
import { deleteImageIfUnusedStatement } from './images.server';

export type ProjectInput = Omit<NewProject, 'id'>;
export type ProjectStatus = 'all' | 'enabled' | 'disabled';

export async function getPublicProjects(db: Db) {
  return db.query.projects.findMany({
    where: { enabled: true },
    orderBy: { displayIndex: 'desc' },
  });
}

export async function getPublicProject(db: Db, id: string) {
  return db.query.projects.findFirst({ where: { id, enabled: true } });
}

export async function getProject(db: Db, id: string) {
  return db.query.projects.findFirst({ where: { id } });
}

export async function listProjects(
  db: Db,
  opts: {
    q?: string;
    page?: number;
    pageSize?: number;
    status?: ProjectStatus;
  } = {},
) {
  const { q, page = 1, pageSize = 10, status = 'all' } = opts;
  const where = and(
    q ? like(projects.projectName, `%${q}%`) : undefined,
    status === 'all' ? undefined : eq(projects.enabled, status === 'enabled'),
  );
  const [rows, total] = await Promise.all([
    db
      .select()
      .from(projects)
      .where(where)
      .orderBy(desc(projects.displayIndex), asc(projects.projectName))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.$count(projects, where),
  ]);
  return { rows, total };
}

export async function createProject(db: Db, input: ProjectInput) {
  const [project] = await db
    .insert(projects)
    .values({ ...input, id: crypto.randomUUID() })
    .returning();
  return project;
}

export async function updateProject(
  db: Db,
  id: string,
  patch: Partial<ProjectInput>,
) {
  const [project] = await db
    .update(projects)
    .set(patch)
    .where(eq(projects.id, id))
    .returning();
  return project;
}

// First id gets the highest displayIndex. One atomic batch.
export async function reorderProjects(db: Db, orderedIds: string[]) {
  const [first, ...rest] = orderedIds.map((id, i) =>
    db
      .update(projects)
      .set({ displayIndex: (orderedIds.length - i) * 10 })
      .where(eq(projects.id, id)),
  );
  if (!first) return;
  await db.batch([first, ...rest]);
}

// Deletes the project, and its image row when nothing else uses it, in one
// atomic batch. Returns the R2 key to delete, or null (image still used, or
// project not found).
export async function deleteProject(db: Db, id: string) {
  const project = await getProject(db, id);
  if (!project) return null;
  const [, deletedImages] = await db.batch([
    db.delete(projects).where(eq(projects.id, id)),
    deleteImageIfUnusedStatement(db, project.imgID),
  ]);
  return deletedImages[0]?.r2Key ?? null;
}
