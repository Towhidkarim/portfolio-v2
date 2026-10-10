// Real data comes from the GitHub GraphQL API (needs GITHUB_TOKEN, no scopes). Without a
// token (local dev) a deterministic stub with the same shape is returned, flagged isStub.

export type Contributions = {
  /** weeks, oldest first; each week has 7 levels (0 to 4), Sunday first */
  weeks: number[][];
  /** short month label per week index, only where a month starts */
  months: { week: number; label: string }[];
  total: number;
  isStub: boolean;
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

const LEVELS: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const QUERY = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { contributionLevel date } }
      }
    }
  }
}`;

type GraphQlResponse = {
  data?: {
    user?: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: {
            contributionDays: { contributionLevel: string; date: string }[];
          }[];
        };
      };
    } | null;
  };
};

export async function fetchGithubContributions(
  token: string,
  login: string,
): Promise<Contributions> {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'portfolio-v2',
    },
    body: JSON.stringify({ query: QUERY, variables: { login } }),
  });
  if (!res.ok) throw new Error(`GitHub responded ${res.status}`);
  const json = (await res.json()) as GraphQlResponse;
  const calendar =
    json.data?.user?.contributionsCollection.contributionCalendar;
  if (!calendar) throw new Error('GitHub returned no contribution calendar');

  const weeks = calendar.weeks.map((w) =>
    w.contributionDays.map((d) => LEVELS[d.contributionLevel] ?? 0),
  );
  const months: Contributions['months'] = [];
  let lastMonth = -1;
  calendar.weeks.forEach((w, i) => {
    const first = w.contributionDays[0]?.date ?? '';
    const month = new Date(`${first}T00:00:00Z`).getUTCMonth();
    if (month !== lastMonth) {
      months.push({ week: i, label: MONTHS[month] });
      lastMonth = month;
    }
  });
  return { weeks, months, total: calendar.totalContributions, isStub: false };
}
