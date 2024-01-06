/** @type {import('prettier').Config} */
const config = {
  printWidth: 100,
  tabWidth: 2,
  quoteProps: 'consistent',
  singleQuote: true,
  plugins: ['prettier-plugin-svelte'],
  overrides: [
    {
      files: '*.svelte',
      options: { parser: 'svelte' },
    },
  ],
};

export default config;
