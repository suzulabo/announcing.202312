import { onMount } from 'svelte';
import type { Action } from 'svelte/action';
import { get, writable } from 'svelte/store';

import type { AnnouncementViewParams, ChannelViewParams } from './ChannelView/types';

type Announcement = Exclude<AnnouncementViewParams['announcement'], undefined>;

const CHUNK_SIZE = 10;

export type ChannelPageParams = Omit<ChannelViewParams, 'noAnnouncements'> & {
  segments: {
    key: string;
    count: number;
  }[];
  loader: (key: string) => Promise<Announcement[]>;
};

export const setup = (params: ChannelPageParams) => {
  const loading = writable(false);
  const error = writable(false);
  const announcements = writable<Announcement[]>([]);

  const pos = {
    segment: 0,
    item: 0,
    loaded: undefined as undefined | Announcement[],
  };

  const next = () => {
    if (!pos.loaded) {
      return false;
    }

    const chunk = pos.loaded.slice(pos.item, pos.item + CHUNK_SIZE);
    if (chunk.length === 0) {
      pos.loaded = undefined;
      pos.segment++;
      return false;
    }

    pos.item = pos.item + CHUNK_SIZE;

    announcements.update((v) => {
      return [...v, ...chunk];
    });

    return true;
  };

  const load = () => {
    if (next()) {
      return;
    }

    if (get(loading)) {
      return;
    }
    const segment = params.segments[pos.segment];
    if (!segment) {
      return;
    }

    loading.set(true);
    params
      .loader(segment.key)
      .then((v) => {
        pos.loaded = v;
        pos.item = 0;
        next();
      })
      .catch(() => {
        error.set(true);
      })
      .finally(() => {
        loading.set(false);
      });
  };

  load();

  const bottomIntersectionAction = (() => {
    let observe: (el: Element) => void;

    onMount(() => {
      const callback: IntersectionObserverCallback = (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            console.log('load');
            load();
            return;
          }
        }
      };
      const observer = new IntersectionObserver(callback, {
        rootMargin: '0px 0px 100% 0px',
      });

      observe = (el) => {
        observer.observe(el);
      };

      return () => {
        observer.disconnect();
      };
    });

    const action: Action = (el) => {
      observe(el);
    };

    return action;
  })();

  const channelViewParams: ChannelViewParams = {
    channel: params.channel,
    msgs: params.msgs,
    noAnnouncements: params.segments.length === 0,
  };

  return { loading, error, announcements, channelViewParams, bottomIntersectionAction };
};
