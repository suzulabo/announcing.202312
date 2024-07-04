// @ts-check

import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import svelte from 'eslint-plugin-svelte';
import { readFileSync } from 'fs';
import globals from 'globals';
import svelteParser from 'svelte-eslint-parser';
import ts from 'typescript-eslint';

const ignores = readFileSync(
  '.prettierignore',
  'utf-8',
)
  .split('\n')
  .map(l => l.trim())
  .filter(l => l.length > 0 && !l.startsWith('#'));

export default ts.config(
  {
    ignores,
  },
  // @ts-ignore
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    quoteProps: 'consistent',
    semi: true,
  }),
  js.configs.recommended,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    files: ['**/*.ts'],
    extends: [
      ...ts.configs.strictTypeChecked,
      ...ts.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: './packages/**/tsconfig.json',
        extraFileExtensions: ['.svelte'],
      },
    },
    rules: {
      '@typescript-eslint/no-unnecessary-condition': 'error',
    },
  },
  ...svelte.configs['flat/recommended'],
  {
    files: ['**/*.svelte'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node,
        ...globals.browser },
      parser: svelteParser,
      parserOptions: {
        parser: { ts: ts.parser },
        extraFileExtensions: ['.svelte'],
      },
    },
    rules: {
      'svelte/no-at-html-tags': 'off',
      // https://github.com/sveltejs/eslint-plugin-svelte/issues/298
      '@typescript-eslint/no-unsafe-call': 'off',
    },
  },
);
