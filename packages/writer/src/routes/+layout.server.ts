import type { LayoutServerLoad } from './$types'

import { detectLocale } from '@announcing/i18n'

export const load: LayoutServerLoad = async ({ locals, cookies, request }) => {
  const userID = (await locals.auth())?.user?.id

  const locale = detectLocale({
    cookie: cookies.get('locale'),
    acceptLanguage: request.headers.get('accept-language') ?? undefined,
  })

  return {
    userID,
    locale,
  }
}
