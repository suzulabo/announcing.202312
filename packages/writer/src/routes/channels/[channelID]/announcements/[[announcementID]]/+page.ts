import { fetchAnnouncement } from '$lib/fetch/fetchAnnouncement';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
  const { channelID, announcementID } = params;
  const parentData = await parent();
  const channel = parentData.channel;

  if (!announcementID) {
    // Create New Announcement
    return {
      channel,
      channelID,
      announcement: undefined,
    };
  }

  if (!channel.announcementIDs || channel.announcementIDs.indexOf(announcementID) < 0) {
    redirect(303, '/');
  }

  const announcement = announcementID
    ? await fetchAnnouncement({ channelID, announcementID }, fetch)
    : undefined;

  if (!announcement) {
    redirect(303, '/');
  }

  const backHref = announcementID
    ? `/channels/${channelID}/announcements/list/${announcementID}`
    : `/channels/${channelID}`;

  return {
    channel,
    channelID,
    announcementID,
    announcement,
    headerBack: {
      href: backHref,
      labelKey: 'back',
    },
  };
};
