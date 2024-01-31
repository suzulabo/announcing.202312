import '@announcing/components/base.scss';

import type { Load } from '@sveltejs/kit';

import { loadTranslations } from '$lib/i18n/translations';

export const load: Load = async ({ url }) => {
  const { pathname } = url;

  const initLocale = 'ja';

  await loadTranslations(initLocale, pathname);

  return {};
};
