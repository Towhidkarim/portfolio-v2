import { drizzleAdapter } from '@better-auth/drizzle-adapter/relations-v2';
import { type BetterAuthOptions, betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { tanstackStartCookies } from 'better-auth/tanstack-start';
import type { Db } from '@/db';
import * as schema from '@/db/schema';
import { ac, roles } from '@/lib/permissions';
import { getDb } from './db.server';
import { getEnv } from './env.server';
import {
  hashPassword,
  MIN_PASSWORD_LENGTH,
  verifyPassword,
} from './password.server';

export type AuthDeps = { db: Db; secret: string; baseURL: string };

// Shared by the app and by schema generation. Roles and permissions come from
// src/lib/permissions.ts.
export const adminPlugin = () =>
  admin({ ac, roles, adminRoles: ['admin'], defaultRole: 'user' });

// Options without plugins and without the TanStack cookie plugin, so the Better
// Auth CLI (schema generation) can load this file outside the Start runtime.
export const authOptions = ({ db, secret, baseURL }: AuthDeps) => {
  const secure = baseURL.startsWith('https://');
  return {
    baseURL,
    secret,
    // `vite preview` serves the production build on another local port.
    trustedOrigins: secure ? [baseURL] : [baseURL, 'http://localhost:4173'],
    database: drizzleAdapter(db, { provider: 'sqlite', schema }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: true, // admins are created with `bun run admin:create`
      minPasswordLength: MIN_PASSWORD_LENGTH,
      password: { hash: hashPassword, verify: verifyPassword },
    },
    // No cookie cache: a signed-out cookie must stop working immediately.
    session: { expiresIn: 60 * 60 * 24 * 14, updateAge: 60 * 60 * 24 },
    rateLimit: {
      enabled: true,
      storage: 'database', // memory is per isolate on Workers
      window: 60,
      max: 30,
      customRules: { '/sign-in/email': { window: 60, max: 5 } },
    },
    advanced: {
      useSecureCookies: secure,
      ipAddress: { ipAddressHeaders: ['cf-connecting-ip', 'x-forwarded-for'] },
    },
  } satisfies BetterAuthOptions;
};

export const createAuth = (deps: AuthDeps) =>
  betterAuth({
    ...authOptions(deps),
    // tanstackStartCookies must be the last plugin so server-side sign-in sets cookies
    plugins: [adminPlugin(), tanstackStartCookies()],
  });

// Per request: the DB binding and secrets only exist inside a request.
export const getAuth = () => {
  const env = getEnv();
  return createAuth({
    db: getDb(),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
  });
};
