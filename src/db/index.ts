import { drizzle } from 'drizzle-orm/d1';
import { appRelations, authRelations } from './schema';

// Relational queries (v2): one merged relations object for app and auth tables.
export const relations = { ...appRelations, ...authRelations };

// Pure factory: takes the binding, reads nothing from the environment.
export const createDb = (d1: D1Database) => drizzle(d1, { relations });

export type Db = ReturnType<typeof createDb>;
