<script lang="ts">
  import Loading from '@announcing/components/Loading.svelte';
  import ResizeObserver from '@announcing/components/ResizeObserver.svelte';
  import { formatDate, toHtml } from '@announcing/components/utils';
  import VirtualScrollList from '@announcing/components/VirtualScrollList.svelte';
  import { LL } from '@announcing/i18n';

  import { page } from '$app/stores';
  import { fetchAnnouncement } from '$lib/fetch/fetchAnnouncement';
  import { normalizePath } from '$lib/utils/normalizePath';

  import type { PageData } from './$types';

  export let data: PageData;

  $: items =
    data.channel.announcementIDs?.map((v) => {
      return { id: v, expand: false, overflow: false };
    }) ?? [];
</script>

<div class="container">
  <VirtualScrollList {items} idKey="id" itemMinHeight={200} gap={8}>
    <div class="item" slot="item" let:item>
      {#await fetchAnnouncement({ channelID: data.channel.channelID, announcementID: item.id })}
        <Loading />
      {:then announcement}
        <ResizeObserver
          onResize={({ el }) => {
            const overflow = el.scrollHeight > el.clientHeight;
            if (item.overflow !== overflow) {
              items = items.map((v) => {
                if (v === item) {
                  return { ...v, overflow };
                }
                return v;
              });
            }
          }}
        >
          <div class="overflow-fade" class:overflow={item.overflow}>
            <div class="top-box">
              <div class="date">
                {#if announcement.createdAt === announcement.updatedAt}
                  <div>{formatDate(announcement.createdAt)}</div>
                {:else}
                  <div>{$LL.announcementView.created()}{formatDate(announcement.createdAt)}</div>
                  <div>{$LL.announcementView.updated()}{formatDate(announcement.updatedAt)}</div>
                {/if}
              </div>
              <a class="button" href={`${$page.url.pathname.replace('list', item.id)}`}>
                {$LL.edit()}
              </a>
              <button>
                {$LL.remove()}
              </button>
            </div>
            {#if announcement.headerImage}
              <img
                class="header-image"
                src={normalizePath(announcement.headerImage)}
                alt="header"
              />
            {/if}
            {#if announcement.title}
              <div class="title">
                {announcement.title}
              </div>
            {/if}
            <div class="body">
              {@html toHtml(announcement.body)}
            </div>
          </div>
        </ResizeObserver>
      {/await}
    </div>
  </VirtualScrollList>
</div>

<style lang="scss">
  .container {
    padding: 8px;

    .item {
      min-height: 200px;
      padding: 8px;
      border: 1px solid var(--color-border);
      border-radius: 4px;

      .overflow-fade {
        max-height: 300px;
        overflow: hidden;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 8px;

        &.overflow:after {
          position: absolute;
          bottom: 0;
          top: 0;
          left: 0;
          right: 0;
          content: '';
          background: linear-gradient(
            to top,
            rgba(var(--color-background-rgb), 1),
            rgba(var(--color-text-rgb), 0) 20%
          );
          pointer-events: none;
        }

        .top-box {
          display: flex;
          align-items: center;
          gap: 8px;

          .date {
            padding: 0 8px;
            color: var(--color-text-light);
            font-size: 14px;
            margin: 0 auto 0 0;
          }

          a.button,
          button {
            padding: 4px;
            width: 80px;
          }
        }

        .header-image {
          max-height: 100px;
          align-self: center;
        }

        .title {
          font-size: 20px;
          padding: 0 8px;
        }

        .body {
          padding: 0 8px;
          line-height: 1.4;
          white-space: pre-wrap;
          :global(a) {
            padding: 0;
            font-weight: normal;
            text-decoration: underline;
          }
        }
      }
    }
  }
</style>
