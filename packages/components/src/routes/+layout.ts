import type { Load } from '@sveltejs/kit'

import { setupLocale } from '@announcing/i18n'
import '$lib/base.scss'

export const load: Load = async () => {
  await setupLocale('ja')
}
