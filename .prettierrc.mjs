/** @type {import('prettier').Config} */
const config = {
  printWidth: 80,
  tabWidth: 2,
  quoteProps: 'consistent',
  singleQuote: true,
  plugins: ['prettier-plugin-svelte'],
  overrides: [
    {
      files: './packages/reader/**/*',
      options: {
        printWidth: 100,
      },
    },
    {
      files: '*.svelte',
      options: { parser: 'svelte' },
    },
  ],
};

export default config;
