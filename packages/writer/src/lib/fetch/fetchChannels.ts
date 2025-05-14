import { browser } from '$app/environment';
import { resolveChannel } from '$lib/db/resolver';
import type { GetChannelResult } from '@announcing/db/types';

let cache: GetChannelResult[] | undefined;

export const fetchChannels = async (fetch_ = fetch) => {
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
      cache = result;
    }

    return result;
  }

  throw new Error(`Fetch Channels Error`);
};

export const clearFetchChannelsCache = () => {
  cache = undefined;
};
