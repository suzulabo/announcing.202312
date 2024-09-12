import '@announcing/components/base.scss';

import { setupLocale } from '@announcing/components/setupLocale';
import type { Load } from '@sveltejs/kit';

import { loadTranslations } from '$lib/i18n/translations';

export const load: Load = async ({ url, data }) => {
  const { pathname } = url;

  const initLocale = 'ja';

  await loadTranslations(initLocale, pathname);

  await setupLocale();

  return { ...data };
};
