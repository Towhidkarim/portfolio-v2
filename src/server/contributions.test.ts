import { describe, expect, it } from 'vitest';
import { getContributionsStub } from './contributions.server';

describe('contributions stub', () => {
  const now = new Date('2026-10-10T12:00:00Z');

  it('is deterministic for the same date', () => {
    expect(getContributionsStub(now)).toEqual(getContributionsStub(now));
  });

  it('has 53 weeks of 7 levels in 0..4 and labels months in order', () => {
    const data = getContributionsStub(now);
    expect(data.weeks).toHaveLength(53);
    for (const week of data.weeks) {
      expect(week).toHaveLength(7);
      for (const level of week) expect(level).toBeGreaterThanOrEqual(0);
      for (const level of week) expect(level).toBeLessThanOrEqual(4);
    }
    expect(data.months[0].week).toBe(0);
    expect(data.isStub).toBe(true);
  });
});
