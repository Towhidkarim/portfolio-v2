import { env } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import { beforeEach, describe, expect, it } from 'vitest';
import { createDb } from '@/db';
import { images, mails, projects } from '@/db/schema';
import { getImage, insertImage } from './images.server';
import {
  archiveMail,
  countUnread,
  createMail,
  deleteMail,
  listMails,
  markMailRead,
} from './mails.server';
import {
  createProject,
  deleteProject,
  getPublicProject,
  getPublicProjects,
  listProjects,
  reorderProjects,
  updateProject,
} from './projects.server';

const db = createDb(env.DB);

beforeEach(async () => {
  await db.delete(projects);
  await db.delete(images);
  await db.delete(mails);
});

type Extra = Partial<{
  enabled: boolean;
  displayIndex: number;
  imgID: string;
}>;

async function makeProject(name: string, extra: Extra = {}) {
  const imgID =
    extra.imgID ??
    (
      await insertImage(db, {
        r2Key: `k-${crypto.randomUUID()}`,
        fileUrl: 'https://media.test/x.png',
      })
    ).id;
  return createProject(db, {
    projectName: name,
    imgUrl: 'https://media.test/x.png',
    summary: 'A summary that is long enough',
    demoLink: 'https://demo.test',
    sourceLink: 'https://src.test',
    tags: ['a', 'b'],
    ...extra,
    imgID,
  });
}

describe('projects', () => {
  it('creates and updates a project', async () => {
    const p = await makeProject('Alpha');
    expect(p.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(p.tags).toEqual(['a', 'b']);
    const u = await updateProject(db, p.id, {
      projectName: 'Alpha 2',
      enabled: false,
    });
    expect(u.projectName).toBe('Alpha 2');
    expect(u.enabled).toBe(false);
  });

  it('public reads only return enabled rows, highest displayIndex first', async () => {
    await makeProject('low', { displayIndex: 10 });
    await makeProject('high', { displayIndex: 30 });
    const hidden = await makeProject('hidden', {
      displayIndex: 99,
      enabled: false,
    });
    const list = await getPublicProjects(db);
    expect(list.map((p) => p.projectName)).toEqual(['high', 'low']);
    expect(await getPublicProject(db, hidden.id)).toBeUndefined();
  });

  it('lists with search, status filter and pagination', async () => {
    await makeProject('React app', { displayIndex: 3 });
    await makeProject('React native', { displayIndex: 2, enabled: false });
    await makeProject('Go service', { displayIndex: 1 });
    expect((await listProjects(db, { q: 'react' })).total).toBe(2);
    expect((await listProjects(db, { status: 'enabled' })).total).toBe(2);
    expect(
      (await listProjects(db, { status: 'disabled' })).rows[0].projectName,
    ).toBe('React native');
    const page = await listProjects(db, { pageSize: 2, page: 2 });
    expect(page.rows).toHaveLength(1);
    expect(page.total).toBe(3);
  });

  it('reorders by assigning descending displayIndex', async () => {
    const a = await makeProject('a');
    const b = await makeProject('b');
    const c = await makeProject('c');
    await reorderProjects(db, [c.id, a.id, b.id]);
    const list = await getPublicProjects(db);
    expect(list.map((p) => p.projectName)).toEqual(['c', 'a', 'b']);
    await reorderProjects(db, []); // no-op
  });

  it('db.batch is atomic: a failing statement rolls back the earlier ones', async () => {
    const a = await makeProject('a', { displayIndex: 1 });
    const b = await makeProject('b', { displayIndex: 2 });
    await expect(
      db.batch([
        db
          .update(projects)
          .set({ displayIndex: 500 })
          .where(eq(projects.id, a.id)),
        // violates NOT NULL, so the whole batch must fail
        db
          .update(projects)
          .set({ projectName: null as unknown as string })
          .where(eq(projects.id, b.id)),
      ]),
    ).rejects.toThrow();
    const list = await getPublicProjects(db);
    expect(list.find((p) => p.id === a.id)?.displayIndex).toBe(1);
  });

  it('enforces the image foreign key', async () => {
    await expect(
      makeProject('orphan', { imgID: 'does-not-exist' }),
    ).rejects.toThrow();
  });

  it('delete removes the image row when unused and returns its key', async () => {
    const p = await makeProject('gone');
    const img = await getImage(db, p.imgID);
    const key = await deleteProject(db, p.id);
    expect(key).toBe(img?.r2Key);
    expect(await getImage(db, p.imgID)).toBeUndefined();
  });

  it('delete keeps a shared image', async () => {
    const first = await makeProject('one');
    await makeProject('two', { imgID: first.imgID });
    expect(await deleteProject(db, first.id)).toBeNull();
    expect(await getImage(db, first.imgID)).toBeDefined();
    expect(await deleteProject(db, 'missing')).toBeNull();
  });
});

describe('mails', () => {
  const input = {
    senderName: 'Ada',
    senderEmail: 'ada@test.dev',
    message: 'Hello there, nice site',
  };

  it('creates, reads, archives and deletes', async () => {
    const m = await createMail(db, input);
    expect(m.readAt).toBeNull();
    expect(await countUnread(db)).toBe(1);

    await markMailRead(db, m.id, true);
    expect(await countUnread(db)).toBe(0);
    await markMailRead(db, m.id, false);
    expect(await countUnread(db)).toBe(1);

    await archiveMail(db, m.id, true);
    expect(await countUnread(db)).toBe(0); // archived mail is not in the inbox
    expect((await listMails(db, { filter: 'inbox' })).total).toBe(0);
    expect((await listMails(db, { filter: 'archived' })).total).toBe(1);

    await archiveMail(db, m.id, false);
    expect((await listMails(db, { filter: 'unread' })).total).toBe(1);

    await deleteMail(db, m.id);
    expect((await listMails(db)).total).toBe(0);
  });

  it('lists newest first with pagination', async () => {
    for (let i = 0; i < 3; i++) {
      await createMail(db, { ...input, senderName: `n${i}` });
      await new Promise((r) => setTimeout(r, 5));
    }
    const page1 = await listMails(db, { pageSize: 2 });
    expect(page1.rows.map((m) => m.senderName)).toEqual(['n2', 'n1']);
    expect(page1.total).toBe(3);
  });
});
