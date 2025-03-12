import type { PageServerLoad } from './$types'

import { getUserID } from '$lib/utils/getUserID'

import { getChannels } from '@announcing/db'

export const load: PageServerLoad = async ({ locals }) => {
  const userID = await getUserID(locals)

  const channels = await getChannels({ userID })

  return { channels }
}
