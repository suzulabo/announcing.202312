import { onMount } from 'svelte';
import type { Action } from 'svelte/action';
import { writable } from 'svelte/store';

import type { AnnouncementViewParams, ChannelViewParams } from './ChannelView/types';

type Announcement = Exclude<AnnouncementViewParams['announcement'], undefined>;

export type ChannelPageParams = Omit<ChannelViewParams, 'noAnnouncements'> & {
  segments: {
    key: string;
    count: number;
  }[];
  loader: (key: string) => Promise<Announcement[]>;
};

type Chunk = {
  pos: number;
  height: string;
  visible: boolean;
};

type SegmentViewParam = {
  visible: boolean;
  height: string;
  chunks: Chunk[];
};

const CHUNK_SIZE = 10;

const LOADING = Symbol('LOADING');
const LOAD_ERROR = Symbol('LOAD_ERROR');

const createSegmentManager = (
  segment: ChannelPageParams['segments'][number],
  loader: ChannelPageParams['loader'],
) => {
  const values = {
    visible: false,
    height: 'auto',
    chunks: [] as Chunk[],
    announcements: undefined as Announcement[] | undefined | typeof LOADING | typeof LOAD_ERROR,
  };

  const addChunk = () => {
    if (segment.count === 0) {
      return false;
    }

    const { chunks } = values;

    const tail = chunks[chunks.length - 1];
    if (tail) {
      if (tail.pos + CHUNK_SIZE < segment.count) {
        chunks.push({ pos: tail.pos + CHUNK_SIZE, height: 'auto', visible: false });
        return true;
      }
    } else {
      chunks.push({ pos: 0, height: 'auto', visible: false });
      return true;
    }
    return false;
  };

  const load = () => {
    if (typeof values.announcements === 'object') {
      return;
    }

    values.announcements = LOADING;
    loader(segment.key)
      .then((v) => {
        values.announcements = v;
      })
      .catch(() => {
        values.announcements = LOAD_ERROR;
      });
  };

  return { ...values, addChunk, load };
};

type SegmentManager = ReturnType<typeof createSegmentManager>;

export const setup = (params: ChannelPageParams) => {
  const segmentManagers: SegmentManager[] = [];

  for (const segment of params.segments) {
    const segmentManager = createSegmentManager(segment, params.loader);
    if (segmentManagers.length === 0) {
      segmentManager.addChunk();
    }
    segmentManagers.push(segmentManager);
  }

  const createSegmentViewParams = (): SegmentViewParam[] => {
    return segmentManagers
      .filter((v) => {
        return v.chunks.length > 0;
      })
      .map<SegmentViewParam>((segmentManager) => {
        console.log({ segmentManager });
        const { visible, height, chunks } = segmentManager;
        return {
          visible,
          height,
          chunks,
        };
      });
  };

  const store = writable({ segments: createSegmentViewParams });

  const updateStore = () => {
    store.update((v) => {
      return { ...v };
    });
  };

  const bottomIntersectionAction = (() => {
    let observe: (el: Element) => void;

    onMount(() => {
      const callback: IntersectionObserverCallback = (entries) => {
        console.log('bottomIntersectionAction', entries);
        for (const entry of entries) {
          if (entry.isIntersecting) {
            for (const manager of segmentManagers) {
              if (manager.addChunk()) {
                updateStore();
                return;
              }
            }
          }
        }

        // End monitoring the intersection as there is no more data.
        observer.disconnect();
      };

      const observer = new IntersectionObserver(callback, {
        rootMargin: '0px 0px 100px 0px',
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

  const segmentIntersectionAction = (() => {
    let observe: (el: Element) => void;

    const elMap = new Map<Element, SegmentManager>();

    onMount(() => {
      const callback: IntersectionObserverCallback = (entries) => {
        console.log('segmentIntersectionAction', entries);
        for (const entry of entries) {
          const manager = elMap.get(entry.target);
          if (!manager) {
            continue;
          }

          if (manager.visible !== entry.isIntersecting) {
            manager.visible = entry.isIntersecting;
            if (entry.isIntersecting) {
              manager.height = 'auto';
            } else {
              manager.height = entry.boundingClientRect.height.toString() + 'px';
            }
            updateStore();
          }
        }
      };

      const observer = new IntersectionObserver(callback, {
        rootMargin: '0px 0px 100px 0px',
      });

      observe = (el) => {
        observer.observe(el);
      };

      return () => {
        observer.disconnect();
      };
    });

    const action: Action<HTMLElement, number> = (el, segmentIndex) => {
      const manager = segmentManagers[segmentIndex];
      if (manager) {
        elMap.set(el, manager);
      }

      observe(el);
    };

    return action;
  })();

  const chunkIntersectionAction = (() => {
    const elMap = new Map<Element, Chunk>();

    let observe: (el: Element) => void;

    onMount(() => {
      const callback: IntersectionObserverCallback = (entries) => {
        console.log('chunkIntersectionAction', entries);
        for (const entry of entries) {
          const chunk = elMap.get(entry.target);
          if (!chunk) {
            continue;
          }

          if (chunk.visible !== entry.isIntersecting) {
            chunk.visible = entry.isIntersecting;
            if (entry.isIntersecting) {
              chunk.height = 'auto';
            } else {
              chunk.height = entry.boundingClientRect.height.toString() + 'px';
            }
            updateStore();
          }
        }
      };

      const observer = new IntersectionObserver(callback, {
        rootMargin: '100px 0px 100px 0px',
      });

      observe = (el) => {
        observer.observe(el);
      };

      return () => {
        observer.disconnect();
      };
    });

    const action: Action<HTMLElement, [number, number]> = (el, [segmentIndex, chunkIndex]) => {
      const manager = segmentManagers[segmentIndex];
      if (manager) {
        const chunk = manager.chunks[chunkIndex];
        if (chunk) {
          elMap.set(el, chunk);
        }
      }
      observe(el);
    };

    return action;
  })();

  const channelViewParams: ChannelViewParams = {
    channel: params.channel,
    msgs: params.msgs,
    noAnnouncements: params.segments.length === 0,
  };

  return {
    store,
    bottomIntersectionAction,
    segmentIntersectionAction,
    chunkIntersectionAction,
    channelViewParams,
  };
};

export const sliceAnnouncements = (chunk: Chunk, announcements: Announcement[]) => {
  return announcements.slice(chunk.pos, CHUNK_SIZE);
};
