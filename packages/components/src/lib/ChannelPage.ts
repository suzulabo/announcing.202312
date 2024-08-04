import type { Action } from 'svelte/action';
import { get, writable } from 'svelte/store';

import { loadChannelViewComponents } from './ChannelView/loader';
import type { AnnouncementViewParams, ChannelViewParams } from './ChannelView/types';

type Announcement = Exclude<AnnouncementViewParams['announcement'], undefined>;

const CHUNK_SIZE = 10;

export type ChannelPageParams = Omit<ChannelViewParams, 'noAnnouncements'> & {
  segments: {
    key: string;
    count: number;
  }[];
  loader: (key: string) => Promise<Announcement[]>;
  viewName: string;
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

  const bottomIntersectionAction: Action = (el) => {
    const callback: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          load();
          return;
        }
      }
    };
    const observer = new IntersectionObserver(callback, {
      rootMargin: '0px 0px 0px 0px',
    });

    observer.observe(el);

    return {
      destroy: () => {
        observer.disconnect();
      },
    };
  };

  const { ChannelView, AnnouncementView } = loadChannelViewComponents(params.viewName);

  const channelViewParams: ChannelViewParams = {
    channel: params.channel,
    noAnnouncements: params.segments.length === 0,
    settingsClick: params.settingsClick,
    msgs: params.msgs,
  };

  return {
    loading,
    error,
    announcements,
    ChannelView,
    AnnouncementView,
    channelViewParams,
    bottomIntersectionAction,
  };
};
