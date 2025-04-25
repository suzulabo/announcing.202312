import type { R2Bucket } from '@cloudflare/workers-types';
import { Miniflare } from 'miniflare';
import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const LOCAL_DIR = '../db-local';
const DRRIZLE_DIR = '../db/drizzle';

export const createLocalBindings = async (memory = false) => {
  const path = memory ? 'memory:' : `file://${resolve(LOCAL_DIR)}`;

  const mf = new Miniflare({
    modules: true,
    script: '',
    d1Databases: ['d1'],
    d1Persist: `${path}/d1`,
    r2Buckets: ['r2'],
    r2Persist: `${path}/r2`,
  });

  const d1 = await mf.getD1Database('d1');
  const r2 = (await mf.getR2Bucket('r2')) as unknown as R2Bucket;

  await d1.exec('CREATE TABLE IF NOT EXISTS __migrations (name TEXT NOT NULL PRIMARY KEY)');

  const migrations = new Set(
    (await d1.prepare('SELECT * FROM __migrations ORDER BY name').all()).results.map((row) => {
      return row['name'] as string;
    }),
  );

  const files = await readdir(DRRIZLE_DIR);
  const sqlFiles = files.filter((file) => file.endsWith('.sql')).sort();

  for (const file of sqlFiles) {
    if (migrations.has(file)) {
      continue;
    }
    const sqlFile = join(DRRIZLE_DIR, file);
    const sql = await readFile(sqlFile, 'utf-8');
    await d1.batch([d1.prepare(sql), d1.prepare('INSERT INTO __migrations VALUES(?)').bind(file)]);
  }

  return { d1, r2 };
};
