import type { GetAnnouncementResult } from '@announcing/db/types';
import { LRUCache } from 'lru-cache';

const cache = new LRUCache<string, GetAnnouncementResult>({ max: 100 });

export const fetchAnnouncement = ({
  channelID,
  announcementID,
}: {
  channelID: string;
  announcementID: string;
}): GetAnnouncementResult | Promise<GetAnnouncementResult> => {
  const cacheKey = `${channelID}-${announcementID}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  return (async () => {
    const res = await fetch(`/api/channels/${channelID}/announcements/${announcementID}`);
    if (res.ok) {
      const data = await res.json();
      cache.set(cacheKey, data);
      return data as GetAnnouncementResult;
    }
    throw new Error('Fetch Announcement Error');
  })();
};
