import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

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

export type TUser = typeof users.$inferSelect;
