import { HstSvelte } from '@histoire/plugin-svelte';
import { defineConfig } from 'histoire';

export default defineConfig({
  plugins: [HstSvelte()],
  setupFile: 'histoire.setup.ts',
  storyIgnored: ['**/node_modules/**', '**/dist/**', '**/.svelte-kit/**'],
  tree: {
    groups: [
      {
        id: 'top',
        title: '',
      },
    ],
  },
});
