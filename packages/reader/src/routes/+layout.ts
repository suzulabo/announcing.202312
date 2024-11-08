import '@announcing/components/base.scss';

import { setupLocale } from '@announcing/i18n';

import { browser } from '$app/environment';

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
  await setupLocale(data.locale);

  if (browser) {
    document.body.setAttribute('locale', data.locale);
  }

  return { ...data };
};

export const prerender = false;
