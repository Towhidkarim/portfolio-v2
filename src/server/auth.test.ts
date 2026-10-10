import { env } from 'cloudflare:workers';
import { betterAuth } from 'better-auth';
import { beforeEach, describe, expect, it } from 'vitest';
import { createDb } from '@/db';
import { account, session, user } from '@/db/schema';
import { buildCreateAdminSql, buildSetPasswordSql } from './admin-sql.server';
import { adminPlugin, authOptions } from './auth.server';
import { hashPassword, verifyPassword } from './password.server';

const db = createDb(env.DB);

// Same options and plugins as the app, minus the TanStack cookie plugin
// (which needs the Start request runtime).
const auth = betterAuth({
  ...authOptions({
    db,
    secret: 'test-secret-test-secret-test-secret-123',
    baseURL: 'http://localhost:3000',
  }),
  plugins: [adminPlugin()],
});

const PASSWORD = 'correct horse battery staple';

async function createAdmin(email = 'admin@example.com', password = PASSWORD) {
  const { sql } = buildCreateAdminSql({
    email,
    name: 'Admin',
    passwordHash: await hashPassword(password),
  });
  await env.DB.exec(sql);
}

beforeEach(async () => {
  await db.delete(session);
  await db.delete(account);
  await db.delete(user);
});

describe('admin created by the CLI SQL', () => {
  it('can sign in with the right password (hash parity with Better Auth)', async () => {
    await createAdmin();
    const res = await auth.api.signInEmail({
      body: { email: 'ADMIN@example.com', password: PASSWORD },
    });
    expect(res.user.email).toBe('admin@example.com');
    expect(res.user.role).toBe('admin');
  });

  it('rejects a wrong password and an unknown email with the same error', async () => {
    await createAdmin();
    const wrong = await auth.api
      .signInEmail({
        body: { email: 'admin@example.com', password: 'nope-nope-nope' },
      })
      .catch((e) => e);
    const unknown = await auth.api
      .signInEmail({
        body: { email: 'ghost@example.com', password: 'nope-nope-nope' },
      })
      .catch((e) => e);
    expect(wrong.body.code).toBe('INVALID_EMAIL_OR_PASSWORD');
    expect(unknown.body.code).toBe(wrong.body.code);
    expect(unknown.body.message).toBe(wrong.body.message);
  });

  it('refuses a duplicate email', async () => {
    await createAdmin();
    await expect(createAdmin()).rejects.toThrow();
  });

  it('set-password changes the password and revokes sessions', async () => {
    await createAdmin();
    await auth.api.signInEmail({
      body: { email: 'admin@example.com', password: PASSWORD },
    });
    expect(await db.$count(session)).toBe(1);

    const next = 'a brand new long password';
    const sql = buildSetPasswordSql({
      email: 'admin@example.com',
      passwordHash: await hashPassword(next),
    });
    await env.DB.exec(sql);

    expect(await db.$count(session)).toBe(0);
    await expect(
      auth.api.signInEmail({
        body: { email: 'admin@example.com', password: PASSWORD },
      }),
    ).rejects.toThrow();
    const ok = await auth.api.signInEmail({
      body: { email: 'admin@example.com', password: next },
    });
    expect(ok.user.email).toBe('admin@example.com');
  });
});

describe('signup and roles', () => {
  it('public sign-up is disabled', async () => {
    await expect(
      auth.api.signUpEmail({
        body: { email: 'x@x.com', password: 'password12345', name: 'x' },
      }),
    ).rejects.toThrow();
    expect(await db.$count(user)).toBe(0);
  });

  it('permissions come from the access-control config', async () => {
    const can = (
      role: 'admin' | 'user',
      permissions: Record<string, string[]>,
    ) =>
      auth.api
        .userHasPermission({
          body: { role, permissions: permissions as never },
        })
        .then((r) => r.success);
    expect(await can('admin', { admin: ['access'] })).toBe(true);
    expect(await can('admin', { project: ['create', 'reorder'] })).toBe(true);
    expect(await can('admin', { mail: ['read'] })).toBe(true);
    expect(await can('user', { admin: ['access'] })).toBe(false);
    expect(await can('user', { project: ['update'] })).toBe(false);
  });
});

describe('password hashing under the Workers runtime', () => {
  it('uses scrypt "salt:key" hashes and measures cost', async () => {
    const runs = 10;
    const t0 = performance.now();
    let hash = '';
    for (let i = 0; i < runs; i++)
      hash = await hashPassword(`${PASSWORD}-${i}`);
    const hashMs = (performance.now() - t0) / runs;

    const t1 = performance.now();
    for (let i = 0; i < runs; i++) {
      expect(
        await verifyPassword({ hash, password: `${PASSWORD}-${runs - 1}` }),
      ).toBe(true);
    }
    const verifyMs = (performance.now() - t1) / runs;

    expect(hash).toMatch(/^[0-9a-f]{32}:[0-9a-f]{128}$/);
    console.log(
      `scrypt in workerd (wall time): hash ${hashMs.toFixed(1)} ms, verify ${verifyMs.toFixed(1)} ms`,
    );
  });
});
