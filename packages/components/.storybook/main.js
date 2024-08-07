/** @type {import('@storybook/sveltekit').StorybookConfig} */
const config = {
  stories: ['../src/**/*.stories.svelte'],
  addons: [
    '@storybook/addon-svelte-csf',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
    'storybook-dark-mode',
  ],
  framework: {
    name: '@storybook/sveltekit',
    options: {},
  },
  staticDirs: ['../public'],
};
export default config;
