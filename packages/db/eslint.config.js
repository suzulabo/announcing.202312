// @ts-check

import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import prettier from 'eslint-config-prettier';
import ts from 'typescript-eslint';

export default ts.config(
  {
    ignores: ['**/node_modules', '**/dist', '**/.svelte-kit'],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  prettier,
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
