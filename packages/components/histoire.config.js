// @ts-check

import { HstSvelte } from '@histoire/plugin-svelte';
import { defineConfig } from 'histoire';

export default defineConfig({
  plugins: [HstSvelte()],
  setupFile: 'src/histoire.setup.ts',
  storyIgnored: ['**/node_modules/**', '**/dist/**', '**/.svelte-kit/**'],
  tree: {
    groups: [
      {
        id: 'top',
        title: '',
      },
    ],
  },
  vite: {
    server: {
      host: '0.0.0.0',
    },
  },
});
