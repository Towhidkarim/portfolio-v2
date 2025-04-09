import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';
import { env } from './env';

config({
  path: '.env',
});

export default defineConfig({
  schema: './db/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DB_AUTH_TOKEN!,
  },
});
