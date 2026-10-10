import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

// Pure factory: takes the binding, reads nothing from the environment.
export const createDb = (d1: D1Database) => drizzle(d1, { schema });

export type Db = ReturnType<typeof createDb>;
