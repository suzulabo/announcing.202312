<script lang="ts" context="module">
  import type { AnnouncementProp, ChannelProp as ViewChannelProp } from './ChannelView/types';

  export type ChannelProp = ViewChannelProp & {
    announcementKeys: {
      key: string;
      count: number;
    }[];
    announcementLoader: (key: string) => Promise<AnnouncementProp[]>;
  };

  class ItemsMap extends Map<
    string,
    {
      pos: number;
      count: number;
      visible: boolean;
      height?: number;
    }[]
  > {
    init(channel: ChannelProp) {
      this.clear();
      const k = channel.announcementKeys[0];
      if (!k) return;

      const { key, count } = k;
      this.set(key, [{ pos: 0, count: Math.min(10, count), visible: false }]);

      return key;
    }
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  import { loadChannelPageComponents } from './ChannelView/loader';
  import Loading from './Loading.svelte';

  export let channel: ChannelProp;

  const announcementsMap = writable(new Map<string, AnnouncementProp[]>());
  const loadingSet = new Set<string>();

  const itemsMap = writable(new ItemsMap());

  $: {
    const m = new ItemsMap();
    const key = m.init(channel);
    itemsMap.set(m);
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
        console.log({ items });
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

  let observer: IntersectionObserver | undefined = undefined;

  onMount(() => {
    const callback: IntersectionObserverCallback = () => {
      //
    };

    observer = new IntersectionObserver(callback, {
      rootMargin: '100px 0px 100px 0px',
    });

    return () => {
      observer?.disconnect();
    };
  });
</script>

{#await loadChannelPageComponents()}
  <Loading show={true} />
{:then { ChannelView, AnnouncementView }}
  <ChannelView {channel}>
    {#each $itemsMap.entries() as [key, a]}
      {#each a as v}
        <div class="observed">
          <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars } -->
          {#each Array(v.count) as _, i}
            <div>
              <AnnouncementView announcement={$announcementsMap.get(key)?.[v.pos + i]} />
            </div>
          {/each}
        </div>
      {/each}
    {/each}
  </ChannelView>
{/await}
