// Used only by `bun run auth:generate` so the Better Auth CLI can read the
// plugins and options and write src/db/auth-schema.ts. Never imported by the app.
import { betterAuth } from 'better-auth';
import type { Db } from '@/db';
import { adminPlugin, authOptions } from './auth.server';

export const auth = betterAuth({
  ...authOptions({
    db: {} as Db, // schema generation never queries
    secret: 'schema-generation-only-secret-0123456789',
    baseURL: 'http://localhost:3000',
  }),
  plugins: [adminPlugin()],
});
