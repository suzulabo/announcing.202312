import type { RequestHandler } from './$types'
import { getAnnouncement } from '@announcing/db'

import { error, json } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ params }) => {
  const { channelID, announcementID } = params

  const result = await getAnnouncement({ channelID, announcementID })
  if (!result) {
    error(404, 'Missing announcement')
  }

  return json(result)
}
