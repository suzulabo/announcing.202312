import { browser } from '$app/environment';
import { fetchChannel } from '$lib/fetch/fetchChannel';
import { getNotificationChannels } from '$lib/platform/localStorage';
import type { GetChannelResult } from '@announcing/db/types';
import type { PageLoad } from './$types';

type Channel =
  | (GetChannelResult & { status: boolean })
  | { channelID: string; name: string; status: 'deleted' };

export const load: PageLoad = async ({ params, fetch }) => {
  if (!browser) {
    return { channels: [] };
  }

  const notificationChannels = getNotificationChannels();

  const channels: Channel[] = await Promise.all(
    Object.entries(notificationChannels).map(async ([channelID, { name }]) => {
      const channel = await fetchChannel(channelID, fetch);
      if (channel) {
        return { ...channel, status: true };
      } else {
        return { channelID, name, status: 'deleted' } as const;
      }
    }),
  );

  const focusChannelID = params.channelID;

  if (focusChannelID) {
    if (!(focusChannelID in notificationChannels)) {
      const channel = await fetchChannel(focusChannelID, fetch);
      if (channel) {
        channels.push({ ...channel, status: false });
      }
    }
  }

  const compareValue = (v: (typeof channels)[number]) => {
    if (v.channelID === focusChannelID) {
      return -1;
    }
    if (v.status === 'deleted') {
      return Number.MAX_SAFE_INTEGER;
    }
    return v.updatedAt;
  };

  channels.sort((a, b) => {
    return compareValue(a) - compareValue(b);
  });

  return {
    channels,
  };
};
