import { loadTranslations } from '$lib/translations';
import '@announcing/components/base.scss';
import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ url }) => {
  const { pathname } = url;

  const initLocale = 'ja'; // get from cookie, user session, ...

  await loadTranslations(initLocale, pathname); // keep this just before the `return`

  return {};
};
