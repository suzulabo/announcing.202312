import { getFavorites } from '$lib/favorites/favorites';
import { fetchChannel } from '$lib/fetch/fetchChannel';
import { isSupported } from 'firebase/messaging';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const favorites = getFavorites();

  const channels = await Promise.all(
    favorites.map(async (favorite) => {
      const channel = await fetchChannel(favorite.channelID, fetch);
      if (channel) {
        return {
          ...channel,
          status: true,
          notification: favorite.notification,
        };
      } else {
        return {
          ...favorite,
          status: 'deleted',
        } as const;
      }
    }),
  );

  const compareValue = (v: (typeof channels)[number]) => {
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
