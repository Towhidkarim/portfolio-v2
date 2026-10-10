import { createServerFn } from '@tanstack/react-start';
import { getContributionsStub } from '../contributions.server';

// Stub source for now (R-21). Swap the implementation, keep the shape.
export const getContributions = createServerFn({ method: 'GET' }).handler(() =>
  getContributionsStub(),
);
