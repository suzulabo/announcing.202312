import { createClient } from '@libsql/client';
import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import { drizzle as drizzleLibSql } from 'drizzle-orm/libsql';
import { env } from './api/env';

const createDB = () => {
  if (env.d1) {
    return drizzleD1(env.d1, { logger: env.logger });
  }
  const sqlite = createClient({ url: 'file:../db-dev/dev.db' });
  return drizzleLibSql(sqlite, { logger: env.logger });
};

let db: ReturnType<typeof createDB> | undefined;

export const getDB = () => {
  if (!db) {
    db = createDB();
  }

  return db;
};
