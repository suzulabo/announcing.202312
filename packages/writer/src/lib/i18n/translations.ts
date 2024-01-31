import i18n, { type Config } from 'sveltekit-i18n';

const config: Config = {
  loaders: [
    {
      locale: 'en',
      key: '',
      loader: async () => (await import('./msgs/en')).default,
    },
    {
      locale: 'ja',
      key: '',
      loader: async () => (await import('./msgs/ja')).default,
    },
  ],
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);
