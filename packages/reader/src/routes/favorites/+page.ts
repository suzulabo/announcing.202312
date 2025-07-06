import { getFavorites } from '$lib/favorites/favorites';
import { fetchChannel } from '$lib/fetch/fetchChannel';
import { isSupported } from 'firebase/messaging';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
  const { channelID } = params;

  const favorites = getFavorites();

  const channels = await Promise.all(
    Object.entries(favorites).map(async ([channelID, values]) => {
      const channel = await fetchChannel(channelID, fetch);
      if (channel) {
        return { ...channel, status: true, notification: favorites[channelID]?.notification };
      } else {
        return { channelID, ...values, status: 'deleted' } as const;
      }
    }),
  );

  const compareValue = (v: (typeof channels)[number]) => {
    if (v.channelID === channelID) {
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

  const supported = await isSupported();

  return {
    channels,
    supported,
  };
};
