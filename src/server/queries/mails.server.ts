import { and, desc, eq, isNotNull, isNull } from 'drizzle-orm';
import type { Db } from '@/db';
import { mails } from '@/db/schema';
import type { TContact } from '@/lib/schemas';

export type MailFilter = 'inbox' | 'unread' | 'archived';

export async function createMail(db: Db, input: TContact) {
  const [mail] = await db
    .insert(mails)
    .values({ ...input, id: crypto.randomUUID() })
    .returning();
  return mail;
}

const filterWhere = (filter: MailFilter) =>
  filter === 'archived'
    ? isNotNull(mails.archivedAt)
    : filter === 'unread'
      ? and(isNull(mails.archivedAt), isNull(mails.readAt))
      : isNull(mails.archivedAt);

export async function listMails(
  db: Db,
  opts: { filter?: MailFilter; page?: number; pageSize?: number } = {},
) {
  const { filter = 'inbox', page = 1, pageSize = 20 } = opts;
  const where = filterWhere(filter);
  const [rows, total] = await Promise.all([
    db
      .select()
      .from(mails)
      .where(where)
      .orderBy(desc(mails.sentAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.$count(mails, where),
  ]);
  return { rows, total };
}

export async function markMailRead(db: Db, id: string, read: boolean) {
  await db
    .update(mails)
    .set({ readAt: read ? new Date().toISOString() : null })
    .where(eq(mails.id, id));
}

export async function archiveMail(db: Db, id: string, archived: boolean) {
  await db
    .update(mails)
    .set({ archivedAt: archived ? new Date().toISOString() : null })
    .where(eq(mails.id, id));
}

export async function deleteMail(db: Db, id: string) {
  await db.delete(mails).where(eq(mails.id, id));
}

export async function countUnread(db: Db) {
  return db.$count(mails, filterWhere('unread'));
}
