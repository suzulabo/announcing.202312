import { detectLocale } from '@announcing/i18n';

import { detectRequestTheme } from '$lib/utils/settings';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies, request }) => {
  const locale = detectLocale({
    cookie: cookies.get('locale'),
    acceptLanguage: request.headers.get('accept-language') ?? undefined,
  });
  const requestTheme = detectRequestTheme(cookies);

  return {
    locale,
    requestTheme,
  };
};
