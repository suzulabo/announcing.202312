import type { PageServerLoad } from './$types'
import { getUserID } from '$lib/utils/getUserID'

import { getChannel } from '@announcing/db'

import { redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params, locals }) => {
  const userID = await getUserID(locals)

  const channel = await getChannel({ userID, channelID: params.channelID })

  if (!channel) {
    redirect(303, '/')
  }

  return {
    channel,
  }
}
