import i18n, { type Config } from 'sveltekit-i18n';

const config: Config<{ value?: string; num?: number }> = {
  loaders: [
    {
      locale: 'en',
      key: '',
      loader: async () => (await import('./msgs/en')).msgs,
    },
    {
      locale: 'ja',
      key: '',
      loader: async () => (await import('./msgs/ja')).msgs,
    },
  ],
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);
