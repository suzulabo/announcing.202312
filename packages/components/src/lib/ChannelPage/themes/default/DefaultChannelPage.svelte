<script lang="ts">
  import { LRUCache } from 'lru-cache';

  import LL from '$lib/i18n/i18n-svelte';
  import Spinner from '$lib/Spinner.svelte';
  import { toHtml } from '$lib/utils/toHtml';
  import VirtualScrollGrid from '$lib/VirtualScrollGrid.svelte';

  import type {
    Announcement,
    AnnouncementClickFunction,
    AnnouncementLoaderFunction,
    Channel,
    SettingsClickFunction,
  } from '../../types';
  import GridItem from './GridItem.svelte';

  export let channel: Channel;
  export let announcementKeys: string[];
  export let announcementLoader: AnnouncementLoaderFunction | undefined;
  export let announcementClick: AnnouncementClickFunction;
  export let settingsClick: SettingsClickFunction | undefined;
  export let channelPreview: boolean | undefined;

  const cache = new LRUCache<string, Announcement>({ max: 100 });

  const announcementClickHandler = (event: Event) => {
    const el = event.currentTarget as HTMLElement;
    const key = el.getAttribute('data-key');
    if (key) {
      announcementClick(key);
    }
  };

  const getAnnouncement = (key: string) => {
    return cache.get(key);
  };
  const loadAnnouncement = async (key: string, loader: AnnouncementLoaderFunction) => {
    const a = await loader(key);
    cache.set(key, a);
    return a;
  };
</script>

<div class="container">
  {#if settingsClick}
    <div class="settings">
      <button on:click={settingsClick}>{$LL.settings()}</button>
    </div>
  {/if}
  <div class="main">
    <div class="title-line">
      <div class="title">
        {channel.title}
      </div>
      {#if channel.icon}
        <img class="icon" src={channel.icon} alt={channel.title} />
      {/if}
    </div>
    {#if channel.desc}
      <div class="desc">
        {@html toHtml(channel.desc)}
      </div>
    {/if}
    {#if !channelPreview}
      <hr />
      {#if announcementKeys.length === 0}
        <div class="no-announcements">
          {$LL.noAnnouncements()}
        </div>
      {:else if !!announcementLoader}
        <VirtualScrollGrid items={announcementKeys} itemHeight={300} itemMinWidth={300} gap={8}>
          <button
            class="unstyled item"
            slot="item"
            let:item
            data-key={item}
            on:click={announcementClickHandler}
          >
            <!-- eslint-disable-next-line @typescript-eslint/no-unsafe-argument -->
            {@const announcement = getAnnouncement(item)}
            {#if announcement}
              <GridItem {announcement} />
            {:else}
              <!-- eslint-disable-next-line @typescript-eslint/no-unsafe-argument -->
              {#await loadAnnouncement(item, announcementLoader)}
                <div class="loading">
                  <Spinner delay="0" />
                </div>
              {:then announcement}
                <GridItem {announcement} />
              {/await}
            {/if}
          </button>
        </VirtualScrollGrid>
      {/if}
    {/if}
  </div>
</div>

<style lang="scss">
  .container {
    padding: 8px;

    .settings {
      text-align: right;
    }

    .main {
      max-width: 1000px;
      margin: 20px auto;

      .title-line {
        margin: 10px 0 0;
        display: flex;
        align-items: center;
        .title {
          font-weight: bold;
          font-size: 20px;
          flex-grow: 1;
        }
        .icon {
          width: 64px;
          height: 64px;
          border-radius: 8px;
          object-fit: contain;
        }
      }

      .desc {
        margin: 10px 5px 0;
        white-space: pre-line;
      }

      hr {
        margin: 20px 0;
      }

      .no-announcements {
        text-align: center;
      }

      .item {
        display: flex;
        flex-direction: column;
        height: 100%;
        border: 1px solid var(--color-border-light);
        border-radius: 4px;
        overflow: hidden;
        cursor: pointer;
        .loading {
          margin: auto;
        }
      }
    }
  }
</style>
