// @ts-check

import { build } from 'esbuild';

await build({
  bundle: true,
  entryPoints: ['src/index.ts'],
  format: 'esm',
  outdir: 'dist',
  target: ['esnext'],
  platform: 'node',
});
