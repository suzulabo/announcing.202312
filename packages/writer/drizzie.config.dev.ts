import type { Config } from 'drizzle-kit';
export default {
  driver: 'better-sqlite',
  schema: './src/lib/db/schema.ts',
  dbCredentials: {
    url: 'dev.db',
  },
} satisfies Config;
