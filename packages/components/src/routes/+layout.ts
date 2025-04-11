import '$lib/base.scss';

import { setupLocale } from '@announcing/i18n';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
  await setupLocale(data.locale);

  return data;
};
