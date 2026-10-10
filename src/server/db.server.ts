import { createDb } from '@/db';
import { getEnv } from './env.server';

// Per call: the DB binding only exists inside a request.
export const getDb = () => createDb(getEnv().DB);
