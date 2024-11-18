import { setDBEnv } from '../src/api';

import { drizzle as drizzleBetterSqlite3 } from 'drizzle-orm/better-sqlite3';
import * as schema from '../src/schema';

import { D1Database, D1DatabaseAPI } from '@miniflare/d1';
import { createSQLiteDB } from '@miniflare/shared';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

export const setupDB = async () => {
  const sqliteDb = await createSQLiteDB(':memory:');
  const db = drizzleBetterSqlite3(sqliteDb, { schema });
  migrate(db, { migrationsFolder: './drizzle' });
  const d1 = new D1Database(new D1DatabaseAPI(sqliteDb));

  setDBEnv(d1);
};
