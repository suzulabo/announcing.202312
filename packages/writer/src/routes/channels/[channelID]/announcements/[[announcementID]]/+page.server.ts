import type { PageServerLoad } from './$types'
import { getUserID } from '$lib/utils/getUserID'

import { getAnnouncement, getChannel } from '@announcing/db'

import { redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params, locals }) => {
  const userID = await getUserID(locals)
  const { channelID, announcementID } = params

  const channel = await getChannel({ userID, channelID })

  if (!channel) {
    redirect(303, '/')
  }

  if (!announcementID) {
    // Create New Announcement
    return {
      channel,
      channelID,
      announcement: undefined,
    }
  }

  if (!channel.announcementIDs || !channel.announcementIDs.includes(announcementID)) {
    redirect(303, '/')
  }

  const announcement = announcementID
    ? await getAnnouncement({ channelID, announcementID })
    : undefined

  if (!announcement) {
    redirect(303, '/')
  }

  return {
    channel,
    channelID,
    announcementID,
    announcement,
  }
}
