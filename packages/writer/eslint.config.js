import config from '@announcing/eslint-config-svelte';
import strictDependencies from 'eslint-plugin-strict-dependencies';

config.push({
  plugins: { 'strict-dependencies': strictDependencies },
  rules: {
    'strict-dependencies/strict-dependencies': [
      'error',
      [
        {
          module: '$lib/db/client',
          allowReferenceFrom: ['src/lib/db/**'],
        },
      ],
    ],
  },
});

export default config;
