import { detectLocale } from '@announcing/i18n';

import type { LayoutServerLoad } from './$types';

import { CF } from '$env/static/private';
import { setDBEnv } from '@announcing/db';

/*
Since await in the load function causes the +page.server.ts load function to run first,
the processing should be done here.
*/
if (!CF) {
  /*
    Cloudflare Pages does not allow local filesystem APIs.
    Therefore, use dynamic import to exclude this code from the Cloudflare build.
   */
  const { createLocalDB } = await import('@announcing/db/localDB');
  setDBEnv(await createLocalDB());
}

export const load: LayoutServerLoad = ({ cookies, request, platform }) => {
  if (CF) {
    if (platform?.env.DB) {
      setDBEnv(platform.env.DB);
    } else {
      throw new Error('D1 DB is not set in platform.env');
    }
  }

  const locale = detectLocale({
    cookie: cookies.get('locale'),
    acceptLanguage: request.headers.get('accept-language') ?? undefined,
  });

  return {
    locale,
  };
};