import type { D1Database, R2Bucket } from '@cloudflare/workers-types';
import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import { createR2Storage } from '../storage/R2Storage';
import type { Storage } from '../storage/storage';

export type DB = DrizzleD1Database;

let localBindings: { d1: D1Database; r2: R2Bucket } | undefined;

export const createDB = async (d1: D1Database | undefined): Promise<DB> => {
  if (d1) {
    console.log('check1');
    return drizzle(d1);
  }

  if (!localBindings) {
    localBindings = await (await import('./localBindings')).createLocalBindings();
  }

  return drizzle(localBindings.d1);
};

export const createStorage = async (r2: R2Bucket | undefined, prefix = ''): Promise<Storage> => {
  if (r2) {
    return createR2Storage(r2, prefix);
  }

  if (!localBindings) {
    localBindings = await (await import('./localBindings')).createLocalBindings();
  }

  return createR2Storage(localBindings.r2, prefix);
};
