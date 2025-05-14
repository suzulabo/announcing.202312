import { browser } from '$app/environment';
import { resolveChannel } from '$lib/db/resolver';
import { getChannelCache, setChannelCache } from './channelCache';

export const fetchChannel = async (channelID: string, fetch_ = fetch) => {
  const cache = getChannelCache(channelID);
  if (cache) {
    return cache;
  }

  const res = await fetch_(`/api/channels/${channelID}`);
  if (res.ok) {
    const json = await res.json();
    const result = resolveChannel(json);

    if (browser) {
      setChannelCache(result);
    }

    return result;
  }

  if (res.status === 404) {
    return;
  }

  throw new Error(`Fetch Channel Error`);
};
