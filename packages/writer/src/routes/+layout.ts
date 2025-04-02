import { browser } from '$app/environment';
import { setupLocale } from '@announcing/i18n';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
  await setupLocale(data.locale);

  if (browser) {
    document.body.setAttribute('locale', data.locale);
  }

  return { ...data };
};

export const prerender = false;

type BackLabelKeys = 'back';

export type HeaderBack = {
  href: string;
  labelKey: BackLabelKeys;
};
