import { and, eq, notExists } from 'drizzle-orm';
import type { Db } from '@/db';
import { images, type NewImage, projects } from '@/db/schema';

export async function insertImage(db: Db, row: Omit<NewImage, 'id'>) {
  const [image] = await db
    .insert(images)
    .values({ ...row, id: crypto.randomUUID() })
    .returning();
  return image;
}

export async function getImage(db: Db, id: string) {
  return db.query.images.findFirst({ where: eq(images.id, id) });
}

// Statement (not yet run) that deletes the image row only when no project
// references it. Reusable inside db.batch.
export const deleteImageIfUnusedStatement = (db: Db, id: string) =>
  db
    .delete(images)
    .where(
      and(
        eq(images.id, id),
        notExists(
          db
            .select({ id: projects.id })
            .from(projects)
            .where(eq(projects.imgID, id)),
        ),
      ),
    )
    .returning({ r2Key: images.r2Key });

// Returns the R2 key the caller must delete, or null if the image is still used.
export async function deleteImageIfUnused(db: Db, id: string) {
  const [deleted] = await deleteImageIfUnusedStatement(db, id);
  return deleted?.r2Key ?? null;
}
