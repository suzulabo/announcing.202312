import { fetchChannel } from '$lib/fetch/fetchChannel';
import type { GetChannelResult } from '@announcing/db/types';
import { getFavorites, type Favorite } from './favorites';

export type FavoriteChannel = Favorite &
  ({ status: 'LOADING' | 'NOT_FOUND' | 'ERROR' } | { status: 'LOADED'; channel: GetChannelResult });

export const fetchFavoriteChannels = (callback: (channels: FavoriteChannel[]) => void) => {
  const favorites = getFavorites();
  const map = new Map<string, FavoriteChannel>(
    favorites.map((v) => [v.channelID, { ...v, status: 'LOADING' }]),
  );

  const compareValue = (v: FavoriteChannel) => {
    switch (v.status) {
      case 'LOADING':
        return 0;
      case 'ERROR':
        return -1;
      case 'NOT_FOUND':
        return -1;
      default:
        return v.channel.updatedAt;
    }
  };

  const updateFavoriteChannels = () => {
    const favoriteChannels = [...map.values()];
    favoriteChannels.sort((a, b) => {
      return compareValue(a) - compareValue(b);
    });
    callback(favoriteChannels);
  };

  updateFavoriteChannels();

  const abortController = new AbortController();

  map.forEach(async (favorite, channelID) => {
    try {
      const channel = await fetchChannel(channelID, fetch, abortController.signal);
      if (channel) {
        map.set(channelID, { ...favorite, status: 'LOADED', channel });
      } else {
        map.set(channelID, { ...favorite, status: 'NOT_FOUND' });
      }
    } catch {
      map.set(channelID, { ...favorite, status: 'ERROR' });
    }

    updateFavoriteChannels();
  });

  return () => {
    abortController.abort();
  };
};
