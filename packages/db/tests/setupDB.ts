import { migrate } from 'drizzle-orm/libsql/migrator';
import process from 'node:process';
import { getDB } from '../src/api/db';

export const setupDB = async () => {
  process.env['DB_URL'] = ':memory:';
  const db = getDB(true);
  await migrate(db, { migrationsFolder: './drizzle' });
};
