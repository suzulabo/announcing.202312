import { build } from 'esbuild';

void build({
  bundle: true,
  entryPoints: ['src/index.ts'],
  format: 'esm',
  outfile: 'dist/index.mjs',
  target: ['esnext'],
});
