// @ts-check

import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import svelteParser from 'svelte-eslint-parser';
import ts from 'typescript-eslint';

export default ts.config(
  {
    ignores: ['**/node_modules', '**/dist', '**/.svelte-kit'],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ...svelte.configs['flat/recommended'],
  prettier,
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
  },
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      'svelte/no-at-html-tags': 'off',
      '@stylistic/padding-line-between-statements': [
        'warn',
        {
          blankLine: 'always',
          prev: '*',
          next: '*',
        },
        {
          blankLine: 'never',
          prev: 'import',
          next: 'import',
        },
        {
          blankLine: 'never',
          prev: 'expression',
          next: 'expression',
        },
        {
          blankLine: 'always',
          prev: 'multiline-expression',
          next: 'expression',
        },
      ],
    },
  },
);
