// Admin management CLI. Targets the LOCAL D1 unless --remote is passed.
//
//   bun run admin:create -- --email me@example.com --name "Me"
//   bun run admin:set-password -- --email me@example.com
//   bun run admin:list
//   add --remote to act on the deployed database (asks for confirmation; --yes skips)
//
// The password is read from the ADMIN_PASSWORD environment variable or prompted
// for (hidden). It is never taken from argv and never printed. Only its hash is
// written, in a temporary SQL file that is deleted afterwards.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import {
  buildCreateAdminSql,
  buildSetPasswordSql,
} from '../src/server/admin-sql.server';
import {
  hashPassword,
  MIN_PASSWORD_LENGTH,
} from '../src/server/password.server';

const DB_NAME = 'portfolio-db';

const [command, ...rest] = process.argv.slice(2);
const flags = new Map<string, string | true>();
for (let i = 0; i < rest.length; i++) {
  const arg = rest[i];
  if (!arg.startsWith('--')) continue;
  const next = rest[i + 1];
  if (next && !next.startsWith('--')) {
    flags.set(arg.slice(2), next);
    i++;
  } else flags.set(arg.slice(2), true);
}
const remote = flags.has('remote');
const str = (name: string) => {
  const v = flags.get(name);
  return typeof v === 'string' ? v : undefined;
};

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function ask(question: string, hidden = false): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });
    if (hidden) {
      // mute echo of typed characters
      (
        rl as unknown as { _writeToOutput: (s: string) => void }
      )._writeToOutput = (s) => {
        if (s.includes(question)) process.stdout.write(s);
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write('\n');
      resolve(answer);
    });
  });
}

async function readPassword() {
  const fromEnv = process.env.ADMIN_PASSWORD;
  const password = fromEnv ?? (await ask('Password: ', true));
  if (!fromEnv && password !== (await ask('Repeat password: ', true))) {
    fail('passwords do not match');
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    fail(`password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }
  return password;
}

async function confirmTarget() {
  if (!remote) return;
  console.log(
    `This will change the DEPLOYED database "${DB_NAME}" (--remote).`,
  );
  if (
    !flags.has('yes') &&
    (await ask('Type "remote" to continue: ')) !== 'remote'
  ) {
    fail('aborted');
  }
}

// SQL always goes through a file: quoting a SQL string on the command line is
// unreliable on Windows.
function runSql(sql: string, extraArgs: string[] = []) {
  const dir = mkdtempSync(join(tmpdir(), 'admin-cli-'));
  const file = join(dir, 'statement.sql');
  try {
    writeFileSync(file, sql, { mode: 0o600 });
    const result = spawnSync(
      'bunx',
      [
        'wrangler',
        'd1',
        'execute',
        DB_NAME,
        remote ? '--remote' : '--local',
        '--yes',
        '--file',
        file,
        ...extraArgs,
      ],
      { encoding: 'utf8' },
    );
    if (result.status !== 0) {
      const out = `${result.stdout}${result.stderr}`;
      fail(
        out.includes('UNIQUE') ? 'a user with that email already exists' : out,
      );
    }
    return result.stdout;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const target = remote ? 'remote' : 'local';

switch (command) {
  case 'create': {
    const email = str('email');
    const name = str('name');
    if (!email || !email.includes('@')) fail('--email is required');
    if (!name) fail('--name is required');
    await confirmTarget();
    const passwordHash = await hashPassword(await readPassword());
    const { userId, sql } = buildCreateAdminSql({ email, name, passwordHash });
    runSql(sql);
    console.log(
      `Created admin ${email.toLowerCase()} (id ${userId}) in the ${target} database.`,
    );
    break;
  }
  case 'set-password': {
    const email = str('email');
    if (!email) fail('--email is required');
    await confirmTarget();
    const passwordHash = await hashPassword(await readPassword());
    runSql(buildSetPasswordSql({ email, passwordHash }));
    console.log(
      `Password updated for ${email.toLowerCase()} in the ${target} database; its sessions were revoked.`,
    );
    break;
  }
  case 'list': {
    const out = runSql(
      'SELECT email, name, role, banned, created_at FROM "user" ORDER BY created_at;',
      ['--json'],
    );
    const rows = (JSON.parse(out)[0]?.results ?? []) as Record<
      string,
      unknown
    >[];
    if (rows.length === 0) console.log(`No users in the ${target} database.`);
    else console.table(rows);
    break;
  }
  default:
    console.log(
      'Usage: bun run admin:create | admin:set-password | admin:list  [-- --email <e> --name <n>] [--remote]',
    );
    process.exit(command ? 1 : 0);
}
