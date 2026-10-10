// Regenerates src/db/auth-schema.ts with the Better Auth CLI.
// The auth config imports the db schema barrel, which imports the file we are
// about to overwrite, so a stale or broken copy would stop the CLI from loading.
// Reset it to a harmless placeholder first.
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const OUTPUT = 'src/db/auth-schema.ts';

writeFileSync(
  OUTPUT,
  '// placeholder, replaced by `bun run auth:generate`\nexport const authRelations = {};\n',
);

const result = spawnSync(
  'bunx',
  [
    'auth@1.7.7',
    'generate',
    '--config',
    'src/server/auth.schema.ts',
    '--output',
    OUTPUT,
    '--yes',
  ],
  { stdio: 'inherit' },
);

process.exit(result.status ?? 1);
