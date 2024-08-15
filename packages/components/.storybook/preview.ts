import '../src/lib/base.scss';

import type { Preview } from '@storybook/svelte';

import MyDecorator from './MyDecorator.svelte';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    darkMode: {
      darkClass: 'dark',
      lightClass: 'light',
      classTarget: 'html',
      stylePreview: true,
    },
  },
  decorators: [
    () => {
      return {
        Component: MyDecorator,
      };
    },
  ],
};

export default preview;
