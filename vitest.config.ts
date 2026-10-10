import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { cloudflareTest } from '@cloudflare/vitest-plugin';
import { defineConfig } from 'vitest/config';

// drizzle-kit 1.0 writes drizzle/<timestamp>_<name>/migration.sql, with
// "--> statement-breakpoint" between statements. Read them in name order.
function readDrizzleMigrations(dir: string) {
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .map((name) => ({
      name: `${name}/migration.sql`,
      queries: readFileSync(path.join(dir, name, 'migration.sql'), 'utf8')
        .split('--> statement-breakpoint')
        .map((q) => q.trim())
        .filter(Boolean),
    }));
}

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    cloudflareTest(() => ({
      miniflare: {
        compatibilityDate: '2026-10-01',
        compatibilityFlags: ['nodejs_compat'],
        d1Databases: ['DB'],
        bindings: {
          TEST_MIGRATIONS: readDrizzleMigrations(
            path.join(import.meta.dirname, 'drizzle'),
          ),
        },
      },
    })),
  ],
  test: {
    include: ['src/**/*.test.ts'],
    setupFiles: ['./test/apply-migrations.ts'],
  },
});
