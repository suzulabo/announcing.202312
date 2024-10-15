import '$lib/base.scss';

import { setupLocale } from '@announcing/i18n';
import type { Load } from '@sveltejs/kit';

export const load: Load = async () => {
  await setupLocale('ja');
};
