import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
  build: {
    minify: true,
  },
  server: {
    host: '0.0.0.0',
    fs: {
      // https://vite.dev/config/server-options.html#server-fs-allow
      allow: ['..'],
    },
  },
  // https://sass-lang.com/documentation/breaking-changes/legacy-js-api/
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
});
