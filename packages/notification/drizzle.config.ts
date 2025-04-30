import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

const env = dotenv.config({ path: '.env.drizzle.local' }).parsed as {
  CF_ACCOUNT_ID: string;
  CF_DATABASE_ID: string;
  CF_D1_TOKEN: string;
};

// https://orm.drizzle.team/docs/guides/d1-http-with-drizzle-kit
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: env.CF_ACCOUNT_ID,
    databaseId: env.CF_DATABASE_ID,
    token: env.CF_D1_TOKEN,
  },
});
