<script lang="ts" context="module">
  import type { AnnouncementProp, ChannelProp as ViewChannelProp } from './ChannelView/types';

  export type ChannelProp = ViewChannelProp & {
    announcementKeys: {
      key: string;
      count: number;
    }[];
    announcementLoader: (key: string) => Promise<AnnouncementProp[]>;
  };

  const ITEMS_CHUNK_SIZE = 10;

  type ItemMapValue = {
    pos: number;
    count: number;
    visible: boolean;
    height?: string;
  };

  class ItemsMap extends Map<string, ItemMapValue[]> {
    init(channel: ChannelProp) {
      this.clear();
      const k = channel.announcementKeys[0];
      if (!k) return;

      const { key, count } = k;
      this.set(key, [{ pos: 0, count: Math.min(ITEMS_CHUNK_SIZE, count), visible: false }]);

      return key;
    }

    expand(channel: ChannelProp) {
      for (const { key, count } of channel.announcementKeys) {
        for (let i = 0; i < count; i = i + ITEMS_CHUNK_SIZE) {
          const v = this.get(key);
          if (!v) {
            this.set(key, [{ pos: 0, count: Math.min(ITEMS_CHUNK_SIZE, count), visible: false }]);
            return;
          }
          if (!v.find((x) => x.pos === i)) {
            v.push({ pos: i, count: Math.min(ITEMS_CHUNK_SIZE, count - i), visible: false });
            return;
          }
        }
      }
    }
  }
</script>

<script lang="ts">
  import type { Action } from 'svelte/action';
  import { type Writable, writable } from 'svelte/store';

  import { loadChannelPageComponents } from './ChannelView/loader';
  import Loading from './Loading.svelte';

  export let channel: ChannelProp;

  const announcementsMap = writable(new Map<string, AnnouncementProp[]>());
  const loadingSet = new Set<string>();

  let itemsMap: Writable<ItemsMap>;

  $: {
    const m = new ItemsMap();
    const key = m.init(channel);
    itemsMap = writable(m);
    loadingSet.clear();
    if (key) loadAnnouncements(key);
  }

  const loadAnnouncements = (key: string) => {
    const announcements = $announcementsMap.get(key);
    if (announcements) return;

    if (loadingSet.has(key)) return;

    loadingSet.add(key);
    void channel
      .announcementLoader(key)
      .then((items) => {
        announcementsMap.update((m) => {
          m.set(key, items);
          // Simple limiter
          if (m.size > 5) {
            // Remove the oldest item
            m.delete(m.keys().next().value as string);
          }
          return new Map(m);
        });
      })
      .finally(() => {
        loadingSet.delete(key);
      });
    return;
  };

  const bottomIntersectionAction: Action = (el) => {
    const callback: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (entry.target === el && entry.isIntersecting) {
          itemsMap.update((m) => {
            m.expand(channel);
            return new ItemsMap(m);
          });
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
    const elMap = new Map<Element, ItemMapValue>();
    const callback: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        const v = elMap.get(entry.target);
        if (!v) continue;

        v.visible = entry.isIntersecting;
        v.height = v.visible ? 'auto' : entry.boundingClientRect.height.toString() + 'px';
      }
      itemsMap.update((m) => new ItemsMap(m));
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: '100px 0px 100px 0px',
    });

    const result: Action<HTMLElement, ItemMapValue> = (el, value) => {
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
</script>

{#await loadChannelPageComponents()}
  <Loading show={true} />
{:then { ChannelView, AnnouncementView }}
  <ChannelView {channel}>
    {#each $itemsMap.entries() as [key, a]}
      {#each a as v}
        <div
          class="items-chunk"
          use:listIntersectionAction={v}
          style={`--height:${v.height ?? 'auto'}`}
        >
          {#if v.visible}
            <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars } -->
            {#each Array(v.count) as _, i}
              <div>
                <AnnouncementView announcement={$announcementsMap.get(key)?.[v.pos + i]} />
              </div>
            {/each}
          {/if}
        </div>
      {/each}
    {/each}
    <div class="__bottom__" use:bottomIntersectionAction></div>
  </ChannelView>
{/await}

<style lang="scss">
  .items-chunk {
    height: var(--height);
  }
</style>
