import path from 'node:path';
import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    cloudflareTest(async () => {
      const migrations = await readD1Migrations(
        path.join(import.meta.dirname, 'drizzle'),
      );
      return {
        miniflare: {
          compatibilityDate: '2026-10-01',
          compatibilityFlags: ['nodejs_compat'],
          d1Databases: ['DB'],
          bindings: { TEST_MIGRATIONS: migrations },
        },
      };
    }),
  ],
  test: {
    include: ['src/**/*.test.ts'],
    setupFiles: ['./test/apply-migrations.ts'],
  },
});
