import type { D1Database, R2Bucket } from '@cloudflare/workers-types';
import { build } from 'esbuild';
import { Miniflare } from 'miniflare';
import { resolve } from 'node:path';

const LOCAL_DIR = '../db-local/v3';

export const createLocalBindings = async () => {
  const built = await build({
    entryPoints: ['src/workers/indexLocal.ts'],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
    target: ['esnext'],
    external: ['cloudflare:workers'],
  });
  const script = built.outputFiles.shift()?.text ?? '';

  const path = `file://${resolve(LOCAL_DIR)}`;

  const mf = new Miniflare({
    modules: true,
    script,
    d1Persist: `${path}/d1`,
    r2Persist: `${path}/r2`,
    d1Databases: { D1: 'd1-local' },
    r2Buckets: { R2: 'r2-local', R2_POST_LOG: 'r2-post-log-local' },
  });

  return await mf.getBindings<{ D1: D1Database; R2: R2Bucket }>();
};
