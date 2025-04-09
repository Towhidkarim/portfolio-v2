import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@/db/schema';
import { env } from '@/env';
import { config } from 'dotenv';

config({ path: '.env' });

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DB_AUTH_TOKEN!,
});

export const db = drizzle(client, { schema });
