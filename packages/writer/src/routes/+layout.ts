import type { LayoutLoad } from './$types'

import { browser } from '$app/environment'

import { setupLocale } from '@announcing/i18n'

import '@announcing/components/base.scss'

export const load: LayoutLoad = async ({ data }) => {
  await setupLocale(data.locale)

  if (browser) {
    document.body.setAttribute('locale', data.locale)
  }

  return { ...data }
}

export const prerender = false
