import { drizzle as drizzleD1, DrizzleD1Database, type AnyD1Database } from 'drizzle-orm/d1';

let db: DrizzleD1Database | undefined;

export const setDBEnv = (d1: AnyD1Database, logger = false) => {
  db = drizzleD1(d1, { logger });
};

export const getDB = () => {
  if (!db) {
    throw new Error('DB is not set');
  }

  return db;
};
