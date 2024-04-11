import { loadTranslations } from '$lib/i18n/translations';
import '@announcing/components/base.scss';
import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ url, data }) => {
  const { pathname } = url;

  const initLocale = 'ja';

  await loadTranslations(initLocale, pathname);

  return { ...data };
};
