import { browser } from '$app/environment';
import { resolveChannel } from '$lib/db/resolver';
import { getChannelsCache, setChannelsCache } from './channelCache';

export const fetchChannels = async (fetch_ = fetch) => {
  const cache = getChannelsCache();
  if (cache) {
    return cache;
  }

  const res = await fetch_('/api/channels');
  if (res.ok) {
    const json = (await res.json()) as [];

    const result = json.map((v) => {
      return resolveChannel(v);
    });

    if (browser) {
      setChannelsCache(result);
    }

    return result;
  }

  throw new Error(`Fetch Channels Error`);
};
