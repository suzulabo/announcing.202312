import type { GetAnnouncementResult } from '@announcing/db/types';
import { LRUCache } from 'lru-cache';

import { promiseCache } from './promiseCache';

const cache = new LRUCache<string, GetAnnouncementResult>({ max: 100 });

export const fetchAnnouncement = (
  {
    channelID,
    announcementID,
  }: {
    channelID: string;
    announcementID: string;
  },
  fetch_ = fetch,
): (GetAnnouncementResult | undefined) | Promise<GetAnnouncementResult | undefined> => {
  const cacheKey = `${channelID}-${announcementID}`;

  console.log('fetchAnnouncement', cacheKey);

  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const url = `/api/channels/${channelID}/announcements/${announcementID}`;

  return promiseCache(url, async () => {
    const res = await fetch_(url);
    if (res.ok) {
      const data = await res.json();
      cache.set(cacheKey, data);
      return data as GetAnnouncementResult;
    }

    console.log('res', { res });

    if (res.status === 404) {
      return;
    }

    throw new Error('Fetch Announcement Error');
  });
};
