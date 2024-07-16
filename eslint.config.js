// @ts-check

import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import svelteParser from 'svelte-eslint-parser';
import ts from 'typescript-eslint';

export default ts.config(
  {
    ignores: [
      '**/node_modules',
      '**/dist',
      '**/.svelte-kit',
      'packages/db-dev',
      'pnpm-lock.yaml',
      'packages/db/drizzle/**/*',
    ],
  },
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
    extends: [...ts.configs.strictTypeChecked, ...ts.configs.stylisticTypeChecked],
    languageOptions: {
      parserOptions: {
        project: './packages/**/tsconfig.json',
        extraFileExtensions: ['.svelte'],
      },
    },
    rules: {
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },
  ...svelte.configs['flat/recommended'],
  {
    files: ['**/*.svelte'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node, ...globals.browser },
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
  prettier,
);
