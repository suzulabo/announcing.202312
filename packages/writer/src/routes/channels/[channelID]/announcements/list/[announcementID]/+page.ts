import type { HeaderBack } from '../../../../../+layout.svelte'
import type { PageLoad } from './$types'
import { fetchAnnouncement } from '$lib/fetch/fetchAnnouncement'

export const load: PageLoad = async ({ params, fetch }) => {
  const { channelID, announcementID } = params

  const announcement = await fetchAnnouncement({ channelID, announcementID }, fetch)

  return {
    channelID,
    announcementID,
    announcement,
    headerBack: {
      href: '../list',
      labelKey: 'back',
    } satisfies HeaderBack,
  }
}
