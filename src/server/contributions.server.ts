// STUB. The real source of GitHub contributions is an owner decision (R-21):
// GraphQL with a token, or a public contributions API. Until then this returns
// deterministic illustrative data shaped like the final response, so the card
// and its server function do not change when the source does.

export type Contributions = {
  /** weeks, oldest first; each week has 7 levels (0 to 4), Sunday first */
  weeks: number[][];
  /** short month label per week index, only where a month starts */
  months: { week: number; label: string }[];
  total: number;
  isStub: true;
};

const WEEKS = 53;
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// small deterministic PRNG so the same week always renders the same way
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getContributionsStub(now = new Date()): Contributions {
  const weeks: number[][] = [];
  const months: Contributions['months'] = [];
  const start = new Date(now);
  start.setUTCDate(start.getUTCDate() - (WEEKS - 1) * 7 - start.getUTCDay());
  let total = 0;
  let lastMonth = -1;
  for (let w = 0; w < WEEKS; w++) {
    const rand = mulberry32(20260 + w);
    const week: number[] = [];
    for (let d = 0; d < 7; d++) {
      const r = rand();
      const level =
        r < 0.5 ? 0 : r < 0.72 ? 1 : r < 0.87 ? 2 : r < 0.96 ? 3 : 4;
      week.push(level);
      total += level * 2;
    }
    weeks.push(week);
    const date = new Date(start);
    date.setUTCDate(date.getUTCDate() + w * 7);
    const month = date.getUTCMonth();
    if (month !== lastMonth) {
      months.push({ week: w, label: MONTHS[month] });
      lastMonth = month;
    }
  }
  return { weeks, months, total, isStub: true };
}
