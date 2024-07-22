import type { Action } from 'svelte/action';
import { writable } from 'svelte/store';

import type { AnnouncementViewParams, ChannelViewParams } from './ChannelView/types';

type Announcement = Exclude<AnnouncementViewParams['announcement'], undefined>;

export type ChannelPageParams = Omit<ChannelViewParams, 'noAnnouncements'> & {
  keys: {
    key: string;
    count: number;
  }[];
  loader: (key: string) => Promise<Announcement[]>;
};

const ITEMS_CHUNK_SIZE = 10;

type Item = {
  pos: number;
  count: number;
  visible: boolean;
  height?: string;
};

export const setup = (params: ChannelPageParams) => {
  const announcementsMap = new Map<string, Announcement[]>();
  const loadingSet = new Set<string>();

  const loadAnnouncements = (key: string) => {
    const announcements = announcementsMap.get(key);
    if (announcements) return;

    if (loadingSet.has(key)) return;

    loadingSet.add(key);
    void params
      .loader(key)
      .then((items) => {
        announcementsMap.set(key, items);
        // Simple limiter
        if (announcementsMap.size > 5) {
          // Remove the oldest item
          const k = announcementsMap.keys().next().value as string;
          announcementsMap.delete(k);
        }
        updateStore();
      })
      .finally(() => {
        loadingSet.delete(key);
      });
    return;
  };

  const itemsMap = new Map<string, Item[]>();

  {
    const k = params.keys[0];
    if (k) {
      const { key, count } = k;
      itemsMap.set(key, [{ pos: 0, count: Math.min(ITEMS_CHUNK_SIZE, count), visible: false }]);
      loadAnnouncements(key);
    }
  }

  const expandItems = () => {
    for (const { key, count } of params.keys) {
      for (let i = 0; i < count; i = i + ITEMS_CHUNK_SIZE) {
        const v = itemsMap.get(key);
        if (!v) {
          itemsMap.set(key, [{ pos: 0, count: Math.min(ITEMS_CHUNK_SIZE, count), visible: false }]);
          return;
        }
        if (!v.find((x) => x.pos === i)) {
          v.push({ pos: i, count: Math.min(ITEMS_CHUNK_SIZE, count - i), visible: false });
          return;
        }
      }
    }
  };

  const entries = () => {
    return itemsMap.entries();
  };

  const getAnnouncementViewParams = (key: string, index: number): AnnouncementViewParams => {
    return {
      announcement: announcementsMap.get(key)?.[index],
    };
  };

  const store = writable({ entries, getAnnouncementViewParams });

  const updateStore = () => {
    store.update((v) => {
      return { ...v };
    });
  };

  const bottomIntersectionAction: Action = (el) => {
    const callback: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (entry.target === el && entry.isIntersecting) {
          expandItems();
          updateStore();
          return;
        }
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: '0px 0px 100px 0px',
    });
    observer.observe(el);

    return {
      destroy: () => {
        observer.disconnect();
      },
    };
  };

  const listIntersectionAction = (() => {
    const elMap = new Map<Element, { key: string; value: Item }>();
    const callback: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        const v = elMap.get(entry.target);
        if (!v) continue;

        const { key, value } = v;
        value.visible = entry.isIntersecting;
        if (value.visible) {
          value.height = 'auto';
          loadAnnouncements(key);
        } else {
          value.height = entry.boundingClientRect.height.toString() + 'px';
        }
      }
      updateStore();
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: '100px 0px 100px 0px',
    });

    const result: Action<HTMLElement, { key: string; value: Item }> = (el, value) => {
      elMap.set(el, value);
      observer.observe(el);

      return {
        destroy: () => {
          observer.disconnect();
        },
      };
    };

    return result;
  })();

  const channelViewParams: ChannelViewParams = {
    channel: params.channel,
    msgs: params.msgs,
    noAnnouncements: params.keys.length === 0,
  };

  return { store, bottomIntersectionAction, listIntersectionAction, channelViewParams };
};
