import type { LayoutLoad } from './$types'

import { setupLocale } from '@announcing/i18n'

import '@announcing/components/base.scss'

export const load: LayoutLoad = async ({ data }) => {
  await setupLocale(data.locale)

  return { ...data }
}

export const prerender = false
