import type { PageServerLoad } from '../$types'

import { redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ locals }) => {
  const userID = (await locals.auth())?.user?.id

  if (userID) {
    return redirect(302, '/')
  }

  return {}
}
