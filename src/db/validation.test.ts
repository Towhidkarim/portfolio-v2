import { describe, expect, it } from 'vitest';
import { ContactSchema } from '@/lib/schemas';
import { ProjectSchema } from './validation';

const validProject = {
  projectName: 'Portfolio',
  imgUrl: 'https://media.test/x.png',
  imgID: 'img-1',
  displayIndex: 10,
  summary: 'A summary that is long enough',
  description: 'A description that is long enough to pass',
  tags: ['react'],
  demoLink: 'https://demo.test',
  sourceLink: 'https://github.com/x/y',
};

describe('ProjectSchema', () => {
  it('accepts a valid project, with id optional', () => {
    expect(ProjectSchema.safeParse(validProject).success).toBe(true);
  });

  it.each([
    ['name too short', { projectName: 'ab' }],
    ['name too long', { projectName: 'x'.repeat(65) }],
    ['summary too short', { summary: 'short' }],
    ['description too short', { description: 'short' }],
    ['bad demo url', { demoLink: 'not a url' }],
    ['bad source url', { sourceLink: 'nope' }],
    ['tags not an array', { tags: 'react' }],
  ])('rejects %s', (_label, patch) => {
    expect(ProjectSchema.safeParse({ ...validProject, ...patch }).success).toBe(
      false,
    );
  });
});

describe('ContactSchema', () => {
  const ok = {
    senderName: 'Ada',
    senderEmail: 'ada@example.com',
    message: 'Hello, nice portfolio!',
  };

  it('accepts and trims valid input', () => {
    const res = ContactSchema.parse({ ...ok, senderName: '  Ada  ' });
    expect(res.senderName).toBe('Ada');
  });

  it.each([
    ['one-letter name', { senderName: 'A' }],
    ['bad email', { senderEmail: 'ada@' }],
    ['short message', { message: 'hi' }],
    ['huge message', { message: 'x'.repeat(2001) }],
  ])('rejects %s', (_label, patch) => {
    expect(ContactSchema.safeParse({ ...ok, ...patch }).success).toBe(false);
  });
});
