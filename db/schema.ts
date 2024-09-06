import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = sqliteTable('user', {
  id: text('id').primaryKey().notNull(),
  username: text('username').notNull(),
  email: text('email').unique().notNull(),
  passwordHash: text('passwordHash'),
  role: text('role', { enum: ['user', 'admin'] }).notNull(),
});

export const sessions = sqliteTable('session', {
  id: text('id').notNull().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at').notNull(),
});

export const siteConfig = sqliteTable('config', {
  registrationsEnabled: integer('registrationsEnabled', { mode: 'boolean' }),
});

export const projects = sqliteTable('project', {
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
});

export const images = sqliteTable('image', {
  id: text('id').primaryKey().notNull(),
  key: text('customID'),
  fileName: text('fileName'),
  fileSize: integer('fileSize'),
  fileUrl: text('fileUrl').notNull(),
});

export const mails = sqliteTable('mail', {
  id: text('id').primaryKey().notNull(),
  sentAt: text('sentAt')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  senderName: text('senderName').notNull(),
  senderEmail: text('senderEmail').notNull(),
  message: text('message').notNull(),
});

export const ProjectSchema = createInsertSchema(projects, {
  id: z.string().optional(),
  projectName: z.string().min(3).max(64),
  imgUrl: z.string().url(),
  displayIndex: z.number(),
  imgID: z.string(),
  description: z.string().min(10).max(2048),
  tags: z.array(z.string()),
  summary: z.string().min(10).max(512),
  demoLink: z.string().url(),
  sourceLink: z.string().url(),
});

export const MailSchema = createInsertSchema(mails);

export type TProject = z.infer<typeof ProjectSchema>;
export type TUser = typeof users.$inferSelect;
export type TImage = typeof images.$inferInsert;
