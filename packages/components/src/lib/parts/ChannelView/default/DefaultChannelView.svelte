<script lang="ts">
  import Spinner from '$lib/atoms/Spinner.svelte';
  import VirtualScrollList from '$lib/atoms/VirtualScrollList.svelte';
  import { toHtml } from '$lib/utils/toHtml';
  import { LL } from '@announcing/i18n';
  import Item from './Item.svelte';
  import type { ComponentProps } from 'svelte';
  import ChannelView from '../ChannelView.svelte';

  let {
    channel,
    announcementHrefPrefix,
    announcementKeys,
    announcementLoader,
  }: ComponentProps<typeof ChannelView> = $props();
</script>

{#if channel}
  <div class="channel-box">
    <div class="name-line">
      <div class="name">
        {channel.name}
      </div>
      {#if channel.icon}
        <img class="icon" alt={channel.name} src={channel.icon} />
      {/if}
    </div>
    {#if channel.desc}
      <div class="desc">
        {@html toHtml(channel.desc)}
      </div>
    {/if}
  </div>
{/if}

{#if announcementKeys && announcementLoader}
  {#if announcementKeys.length === 0}
    <div class="no-announcements">
      {$LL.noAnnouncements()}
    </div>
  {:else}
    <VirtualScrollList keys={announcementKeys} itemMinHeight={200} gap={8}>
      {#snippet itemSnippet(key)}
        <a class="item unstyled" href={`${announcementHrefPrefix}/${key}`}>
          {#await announcementLoader(key)}
            <div class="loading">
              <Spinner />
            </div>
          {:then announcement}
            {#if announcement}
              <Item {announcement} />
            {/if}
          {:catch}
            <div class="error">{$LL.failedToDataLoad()}</div>
          {/await}
        </a>
      {/snippet}
    </VirtualScrollList>
  {/if}
{/if}

<style lang="scss">
  .channel-box {
    padding: 0 16px 8px;
  }

  .name-line {
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

  .no-announcements {
    text-align: center;
  }

  .item {
    margin: 0 8px;
    padding: 0 0 8px;
    border: 1px solid var(--color-border-light);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    min-height: 200px;
    max-height: 50dvh;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    .loading,
    .error {
      margin: auto;
    }

    &:has(.error) {
      cursor: default;
      pointer-events: none;
    }
  }
</style>
