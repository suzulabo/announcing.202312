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
    (_, context) => {
      return {
        Component: MyDecorator,
        props: {
          context,
        },
      };
    },
  ],
  globalTypes: {
    locale: {
      name: 'Locale',
      description: 'Internationalization locale',
      defaultValue: 'en',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', right: '🇺🇸', title: 'English' },
          { value: 'ja', right: '🇯🇵', title: '日本語' },
        ],
      },
    },
  },
};

export default preview;
