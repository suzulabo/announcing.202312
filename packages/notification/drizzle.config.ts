import { defineConfig } from 'drizzle-kit';

// https://orm.drizzle.team/docs/guides/d1-http-with-drizzle-kit
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env['CF_ACCOUNT_ID'] ?? '',
    databaseId: process.env['CF_DATABASE_ID'] ?? '',
    token: process.env['CF_D1_TOKEN'] ?? '',
  },
});
