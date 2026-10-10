import { defineRelations } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Application tables only. Better Auth tables live in auth-schema.ts (Phase 2).

export const images = sqliteTable('image', {
  id: text('id').primaryKey().notNull(), // crypto.randomUUID()
  r2Key: text('r2Key').notNull().unique(), // object key in the MEDIA bucket
  fileName: text('fileName'),
  fileSize: integer('fileSize'),
  fileUrl: text('fileUrl').notNull(), // PUBLIC_MEDIA_BASE_URL + '/' + r2Key
});

export const projects = sqliteTable(
  'project',
  {
    id: text('id').primaryKey().notNull(),
    projectName: text('projectName').notNull(),
    displayIndex: integer('displayIndex').default(0).notNull(),
    imgUrl: text('imgUrl').notNull(),
    imgID: text('imgID')
      .references(() => images.id)
      .notNull(),
    tags: text('tags', { mode: 'json' }).$type<string[]>(),
    summary: text('summary').notNull(),
    description: text('description'),
    enabled: integer('enabled', { mode: 'boolean' }).default(true).notNull(),
    demoLink: text('demoLink').notNull(),
    sourceLink: text('sourceLink').notNull(),
  },
  (t) => [index('project_public_idx').on(t.enabled, t.displayIndex)],
);

export const mails = sqliteTable(
  'mail',
  {
    id: text('id').primaryKey().notNull(),
    // ISO 8601 string; readAt/archivedAt use the same format
    sentAt: text('sentAt')
      .$defaultFn(() => new Date().toISOString())
      .notNull(),
    senderName: text('senderName').notNull(),
    senderEmail: text('senderEmail').notNull(),
    message: text('message').notNull(),
    readAt: text('readAt'), // null = unread
    archivedAt: text('archivedAt'), // null = in inbox
  },
  (t) => [index('mail_inbox_idx').on(t.archivedAt, t.sentAt)],
);

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Image = typeof images.$inferSelect;
export type NewImage = typeof images.$inferInsert;
export type Mail = typeof mails.$inferSelect;

// Relational-query (v2) definitions for the app tables. The generated
// auth-schema.ts exports its own `authRelations` part; src/db/index.ts merges both.
export const appRelations = defineRelations(
  { images, projects, mails },
  (r) => ({
    projects: {
      image: r.one.images({ from: r.projects.imgID, to: r.images.id }),
    },
    images: {
      projects: r.many.projects({ from: r.images.id, to: r.projects.imgID }),
    },
  }),
);
