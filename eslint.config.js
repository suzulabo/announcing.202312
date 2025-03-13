// @ts-check

import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['packages/i18n/src/i18n/**/*'],
  typescript: true,
  svelte: true,
  rules: {
    'no-console': 'off',
    'no-alert': 'off',
  },
}).override('antfu/svelte/rules', { rules: {
  'no-use-before-define': 'off',
  'svelte/no-at-html-tags': 'off',
} })
