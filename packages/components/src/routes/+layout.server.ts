import { detectLocale } from '@announcing/i18n';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, request }) => {
  const locale = detectLocale({
    cookie: cookies.get('locale'),
    acceptLanguage: request.headers.get('accept-language') ?? undefined,
  });

  return {
    locale,
  };
};
