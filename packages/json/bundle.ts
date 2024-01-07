import { build } from 'esbuild';

void build({
  bundle: true,
  entryPoints: ['src/index.ts'],
  format: 'esm',
  outdir: 'dist',
  target: ['esnext'],
});
