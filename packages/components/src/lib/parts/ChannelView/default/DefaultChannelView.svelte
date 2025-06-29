<script lang="ts">
  import Spinner from '$lib/atoms/Spinner.svelte';
  import VirtualScrollList from '$lib/atoms/VirtualScrollList.svelte';
  import { parseImageSize } from '$lib/utils/parseImageSize';
  import { toHtml } from '$lib/utils/toHtml';
  import { LL } from '@announcing/i18n';
  import type { ChannelViewProps } from '../types';
  import Item from './Item.svelte';

  let { channel, announcementHrefPrefix, announcementKeys, announcementLoader }: ChannelViewProps =
    $props();
</script>

{#if channel}
  <div class="channel-box">
    <div class="name-line">
      <div class="name">
        {channel.name}
      </div>
      {#if channel.icon}
        <img class="icon" alt={channel.name} src={channel.icon} {...parseImageSize(channel.icon)} />
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
        <hr />
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
    padding: 0 16px 16px;
  }

  .name-line {
    display: flex;
    align-items: center;
    gap: 8px;
    .name {
      font-weight: bold;
      font-size: 20px;
      flex-grow: 1;
    }
    .icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
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

  hr {
    border-top: 1px solid var(--color-border);
    margin-bottom: 16px;
  }

  .item {
    padding: 0 16px 8px;
    display: flex;
    flex-direction: column;
    min-height: 200px;
    max-height: 50svh;
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
