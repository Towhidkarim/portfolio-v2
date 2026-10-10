import { getTableName } from 'drizzle-orm';
import type { SQLiteColumn } from 'drizzle-orm/sqlite-core';
import { account, session, user } from '@/db/schema';

// Builds the SQL the admin CLI runs through `wrangler d1 execute`. Column names
// and value encoding come from the Drizzle table objects (so they follow the
// generated auth schema), and the password arrives already hashed by the same
// function Better Auth uses at sign-in.

type Table = typeof user | typeof account;

const literal = (col: SQLiteColumn, value: unknown) => {
  if (value === null || value === undefined) return 'NULL';
  const v = col.mapToDriverValue(value);
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return v ? '1' : '0';
  return `'${String(v).replaceAll("'", "''")}'`;
};

const column = (table: Table, key: string) =>
  (table as unknown as Record<string, SQLiteColumn>)[key];

function insert(table: Table, row: Record<string, unknown>) {
  const entries = Object.entries(row).map(
    ([k, v]) => [column(table, k), v] as const,
  );
  const cols = entries.map(([c]) => `"${c.name}"`).join(', ');
  const vals = entries.map(([c, v]) => literal(c, v)).join(', ');
  return `INSERT INTO "${getTableName(table)}" (${cols}) VALUES (${vals});`;
}

export function buildCreateAdminSql(input: {
  email: string;
  name: string;
  passwordHash: string;
  now?: Date;
}) {
  const now = input.now ?? new Date();
  const userId = crypto.randomUUID();
  const sql = [
    insert(user, {
      id: userId,
      name: input.name,
      email: input.email.toLowerCase(),
      emailVerified: true,
      role: 'admin',
      banned: false,
      createdAt: now,
      updatedAt: now,
    }),
    insert(account, {
      id: crypto.randomUUID(),
      accountId: userId,
      providerId: 'credential',
      userId,
      password: input.passwordHash,
      createdAt: now,
      updatedAt: now,
    }),
  ].join('\n');
  return { userId, sql };
}

export function buildSetPasswordSql(input: {
  email: string;
  passwordHash: string;
  now?: Date;
}) {
  const now = input.now ?? new Date();
  const email = literal(column(user, 'email'), input.email.toLowerCase());
  const whoId = `(SELECT "${column(user, 'id').name}" FROM "${getTableName(user)}" WHERE "${column(user, 'email').name}" = ${email})`;
  return [
    `UPDATE "${getTableName(account)}" SET "${column(account, 'password').name}" = ${literal(column(account, 'password'), input.passwordHash)}, "${column(account, 'updatedAt').name}" = ${literal(column(account, 'updatedAt'), now)} WHERE "${column(account, 'providerId').name}" = 'credential' AND "${column(account, 'userId').name}" = ${whoId};`,
    // a changed password signs the user out everywhere
    `DELETE FROM "${getTableName(session)}" WHERE "${(session.userId as SQLiteColumn).name}" = ${whoId};`,
  ].join('\n');
}
