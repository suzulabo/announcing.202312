import rootConfig from '../../.prettierrc.mjs';

/** @type {import('prettier').Config} */
const config = {
  ...rootConfig,
  printWidth: 100,
  plugins: ['prettier-plugin-svelte'],
  overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
};

export default config;
