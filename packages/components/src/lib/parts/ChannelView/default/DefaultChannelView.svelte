<script lang="ts">
  import { LL } from '@announcing/i18n';

  import Spinner from '$lib/atoms/Spinner.svelte';
  import VirtualScrollGrid from '$lib/atoms/VirtualScrollGrid.svelte';
  import { toHtml } from '$lib/utils/toHtml';

  import type { ChannelViewParams } from '../ChannelView.svelte';
  import GridItem from './GridItem.svelte';

  export let params: ChannelViewParams;

  $: ({ channel, announcementHrefPrefix, announcementKeys, announcementLoader } = params);
</script>

<div class="name-line">
  <div class="name">
    {channel.name}
  </div>
  {#if channel.icon}
    <img class="icon" src={channel.icon} alt={channel.name} />
  {/if}
</div>
{#if channel.desc}
  <div class="desc">
    {@html toHtml(channel.desc)}
  </div>
{/if}

{#if announcementKeys && announcementLoader}
  <hr />
  {#if announcementKeys.length === 0}
    <div class="no-announcements">
      {$LL.noAnnouncements()}
    </div>
  {:else}
    <VirtualScrollGrid items={announcementKeys} itemHeight={300} itemMinWidth={300} gap={8}>
      <a class="item" slot="item" let:item href={`${announcementHrefPrefix}${item}`}>
        {#await announcementLoader(item)}
          <div class="loading">
            <Spinner />
          </div>
        {:then announcement}
          <GridItem {announcement} />
        {/await}
      </a>
    </VirtualScrollGrid>
  {/if}
{/if}

<style lang="scss">
  .name-line {
    margin: 10px 0 0;
    display: flex;
    align-items: center;
    .name {
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
</style>
