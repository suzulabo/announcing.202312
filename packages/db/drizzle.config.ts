import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/schema.ts',
  dbCredentials: {
    url: 'file:../db-dev/dev.db',
  },
});
