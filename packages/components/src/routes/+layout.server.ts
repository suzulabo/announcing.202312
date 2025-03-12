import type { LayoutServerLoad } from './$types'

import { detectLocale } from '@announcing/i18n'

export const load: LayoutServerLoad = ({ cookies, request }) => {
  const locale = detectLocale({
    cookie: cookies.get('locale'),
    acceptLanguage: request.headers.get('accept-language') ?? undefined,
  })

  return {
    locale,
  }
}
