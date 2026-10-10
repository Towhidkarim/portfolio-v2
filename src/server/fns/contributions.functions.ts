import { createServerFn } from '@tanstack/react-start';
import { GITHUB_LOGIN } from '@/content/site';
import {
  fetchGithubContributions,
  getContributionsStub,
} from '../contributions.server';
import { getEnv } from '../env.server';

// Real data when GITHUB_TOKEN is set, the stub otherwise (local dev). A GitHub
// failure returns null so the home page renders without the card instead of failing.
// Edge caching of this call comes in Phase 5.
export const getContributions = createServerFn({ method: 'GET' }).handler(
  async () => {
    const token = getEnv().GITHUB_TOKEN;
    if (!token) return getContributionsStub();
    try {
      return await fetchGithubContributions(token, GITHUB_LOGIN);
    } catch (error) {
      console.error('contributions fetch failed', error);
      return null;
    }
  },
);
