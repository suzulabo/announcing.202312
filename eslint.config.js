// @ts-check

// [memo] https://github.com/sveltejs/eslint-plugin-svelte/issues/732#issuecomment-2176982343

import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import svelteParser from 'svelte-eslint-parser';
import ts from 'typescript-eslint';

const jsConfig = ts.config({
  files: ['**/*.js'],
  extends: [js.configs.recommended],
});

const tsConfig = ts.config({
  files: ['**/*.ts', '**/*.svelte'],
  extends: [
    js.configs.recommended,
    ...ts.configs.strictTypeChecked,
    ...ts.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: true,
      extraFileExtensions: ['.svelte'],
    },
  },
  rules: {
    '@typescript-eslint/no-unnecessary-condition': 'error',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/restrict-template-expressions': [
      'error',
      {
        allowNumber: true,
      },
    ],
  },
});

const svelteConfig = ts.config({
  files: ['**/*.svelte'],
  extends: [...svelte.configs['flat/recommended'], ...svelte.configs['flat/prettier']],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: { ...globals.node, ...globals.browser },
    parser: svelteParser,
    parserOptions: {
      parser: ts.parser,
    },
  },
  settings: {
    svelte: {
      // https://github.com/sveltejs/eslint-plugin-svelte/issues/442
      // https://sveltejs.github.io/eslint-plugin-svelte/user-guide/#settings-svelte-ignore-warnings
      ignoreWarnings: [
        '@typescript-eslint/no-unsafe-assignment',
        '@typescript-eslint/no-unsafe-member-access',
      ],
    },
  },
  rules: {
    'svelte/no-at-html-tags': 'off',
    // https://github.com/sveltejs/eslint-plugin-svelte/issues/298
    '@typescript-eslint/no-unsafe-call': 'off',
    // TODO: It does not seem to be working well.
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
  },
});

const sortConfig = ts.config({
  files: ['**/*.js', '**/*.ts', '**/*.svelte'],
  plugins: {
    'simple-import-sort': simpleImportSort,
  },
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
});

export default ts.config(
  {
    ignores: [
      'pnpm-lock.yaml',
      '**/node_modules',
      '**/dist',
      '**/.svelte-kit',
      'packages/db-dev',
      'packages/db/drizzle/**/*',
      '**/test-results',
      '**/playwright-report',
    ],
  },
  ...jsConfig,
  ...tsConfig,
  ...svelteConfig,
  ...sortConfig,
  prettier,
);
