import { drizzle as drizzleBetterSqlite3 } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

import { D1Database, D1DatabaseAPI } from '@miniflare/d1';
import { createSQLiteDB } from '@miniflare/shared';
import * as schema from '../schema';

export const createLocalDB = async (inMemory = false) => {
  const sqliteDb = await createSQLiteDB(inMemory ? ':memory:' : '../db-dev/dev.db');

  if (inMemory) {
    const db = drizzleBetterSqlite3(sqliteDb, { schema });
    migrate(db, { migrationsFolder: './drizzle' });
  }

  const d1 = new D1Database(new D1DatabaseAPI(sqliteDb));

  return d1;
};
