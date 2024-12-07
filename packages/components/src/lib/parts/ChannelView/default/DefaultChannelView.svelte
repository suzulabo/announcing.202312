<script lang="ts">
  import { LL } from '@announcing/i18n';

  import Spinner from '$lib/atoms/Spinner.svelte';
  import { toHtml } from '$lib/utils/toHtml';

  import VirtualScrollList from '$lib/atoms/VirtualScrollList.svelte';
  import type { ChannelViewProps } from '../ChannelView.svelte';
  import Item from './Item.svelte';
  import { imgSrc } from '$lib/actions/imgSrc';

  let { channel, announcementHrefPrefix, announcementKeys, announcementLoader }: ChannelViewProps =
    $props();
</script>

<div class="channel-box">
  <div class="name-line">
    <div class="name">
      {channel.name}
    </div>
    {#if channel.icon}
      <img class="icon" alt={channel.name} use:imgSrc={channel.icon} />
    {/if}
  </div>
  {#if channel.desc}
    <div class="desc">
      {@html toHtml(channel.desc)}
    </div>
  {/if}
</div>

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
          {/await}
        </a>
      {/snippet}
    </VirtualScrollList>
  {/if}
{/if}

<style lang="scss">
  .channel-box {
    padding: 8px 8px 16px;
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
    display: flex;
    flex-direction: column;
    min-height: 200px;
    max-height: 50svh;
    background-color: var(--color-background-light);
    margin: 0 8px;
    padding: 8px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;

    --color-gradient: var(--color-background-light);

    .loading {
      margin: auto;
    }

    @media (hover: hover) {
      &:hover {
        background-color: var(--color-hover-light);
        --color-gradient: var(--color-hover-light);
      }
    }
  }
</style>
