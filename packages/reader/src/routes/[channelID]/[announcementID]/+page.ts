import { fetchAnnouncement } from '$lib/fetch/fetchAnnouncement';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
  const { channelID, announcementID } = params;

  const announcement = await fetchAnnouncement({ channelID, announcementID }, fetch);

  return {
    channelID,
    announcementID,
    announcement,
    headerBack: {
      href: `/${channelID}`,
      labelKey: 'back',
    },
  };
};
