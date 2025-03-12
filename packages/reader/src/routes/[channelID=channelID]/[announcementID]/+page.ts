import type { PageLoad } from './$types'
import { fetchAnnouncement } from '$lib/fetch/fetchAnnouncement'
import { error } from '@sveltejs/kit'

export const load: PageLoad = async ({ params, fetch }) => {
  const { channelID, announcementID } = params

  const announcement = await fetchAnnouncement({ channelID, announcementID }, fetch)

  if (!announcement) {
    error(404)
  }

  return {
    channelID,
    announcementID,
    announcement,
    headerBack: {
      href: `/${channelID}`,
      labelKey: 'back',
    },
  }
}
