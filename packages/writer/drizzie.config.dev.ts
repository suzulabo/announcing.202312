import type { Config } from 'drizzle-kit';
export default {
  driver: 'libsql',
  schema: './src/lib/db/schema.ts',
  dbCredentials: {
    url: 'file:dev.db',
  },
} satisfies Config;
