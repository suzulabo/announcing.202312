import { detectLocale } from '@announcing/i18n';

import { getRequestTheme } from '$lib/utils/settings';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies, request }) => {
  const locale = detectLocale({
    cookie: cookies.get('locale'),
    acceptLanguage: request.headers.get('accept-language') ?? undefined,
  });
  const requestTheme = getRequestTheme(cookies);

  return {
    locale,
    requestTheme,
  };
};
