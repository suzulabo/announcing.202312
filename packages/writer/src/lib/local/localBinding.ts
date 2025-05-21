import { build } from 'esbuild';
import { Miniflare } from 'miniflare';
import { resolve } from 'node:path';

const LOCAL_DIR = '../db-local/v3';

export const createLocalBindings = async (): Promise<App.Platform['env']> => {
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
    d1Databases: { D1: 'd1-local' },
    d1Persist: `${path}/d1`,
    r2Buckets: { R2: 'r2-local', R2_POST_LOG: 'r2-post-log-local' },
    r2Persist: `${path}/r2`,
    workflows: {
      WF_STORE_POST_LOG: {
        name: 'StorePostLogWorkflow',
        className: 'StorePostLogWorkflowEntrypoint',
      },
    },
  });

  return await mf.getBindings();
};
