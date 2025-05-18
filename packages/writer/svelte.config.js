// @ts-check

import adapterCF from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapterCF({
      config: 'wrangler.remote.jsonc',
      routes: {
        include: ['/*'],
        exclude: ['<all>'],
      },
    }),
  },

  compilerOptions: {
    runes: true,
  },
};

export default config;
