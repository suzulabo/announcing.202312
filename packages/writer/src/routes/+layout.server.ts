import { detectLocale } from '@announcing/i18n';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies, request }) => {
  const userID = (await locals.auth())?.user?.id;

  const locale = detectLocale({
    cookie: cookies.get('locale'),
    acceptLanguage: request.headers.get('accept-language') ?? undefined,
  });

  return {
    userID,
    locale,
  };
};
