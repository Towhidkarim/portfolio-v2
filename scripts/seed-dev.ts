// Inserts sample rows into the LOCAL D1 only (.wrangler/state). getPlatformProxy
// never talks to the remote database unless remote bindings are requested, and
// this script does not request them.
import { getPlatformProxy } from 'wrangler';
import { createDb } from '../src/db';
import { images, mails, projects } from '../src/db/schema';

if (process.argv.includes('--remote')) {
  throw new Error('seed-dev only writes to the local database.');
}

const { env, dispose } = await getPlatformProxy<{ DB: D1Database }>({
  configPath: './wrangler.jsonc',
});

try {
  const db = createDb(env.DB);

  const samples = [
    { name: 'Sample project one', tags: ['React', 'TypeScript', 'Tailwind'] },
    { name: 'Sample project two', tags: ['Next.js', 'PostgreSQL', 'Docker'] },
    { name: 'Sample project three', tags: ['Node.js', 'Hono', 'Redis'] },
  ];

  await db.delete(projects);
  await db.delete(images);
  await db.delete(mails);

  for (const [i, s] of samples.entries()) {
    const imageId = crypto.randomUUID();
    await db.insert(images).values({
      id: imageId,
      r2Key: `seed/${i + 1}.svg`,
      fileName: `${i + 1}.svg`,
      fileUrl: '/images/contact.svg',
    });
    await db.insert(projects).values({
      id: crypto.randomUUID(),
      projectName: s.name,
      displayIndex: (samples.length - i) * 10,
      imgUrl: '/images/contact.svg',
      imgID: imageId,
      tags: s.tags,
      summary: 'One line on what it does and who it is for.',
      description:
        'A longer write-up of the project: the problem, the approach and what was learned.',
      enabled: true,
      demoLink: 'https://example.com',
      sourceLink: 'https://github.com/Towhidkarim/',
    });
  }

  await db.insert(mails).values({
    id: crypto.randomUUID(),
    senderName: 'Ada Lovelace',
    senderEmail: 'ada@example.com',
    message: 'Hi! Loved the site. Are you open to a short contract?',
  });

  console.log(
    `Seeded ${samples.length} projects, ${samples.length} images, 1 mail (local D1).`,
  );
} finally {
  await dispose();
}
