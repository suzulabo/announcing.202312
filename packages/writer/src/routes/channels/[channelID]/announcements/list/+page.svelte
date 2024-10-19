<script lang="ts">
  import { imgSrc } from '@announcing/components/actions/imgSrc';
  import Loading from '@announcing/components/Loading.svelte';
  import ResizeObserver from '@announcing/components/ResizeObserver.svelte';
  import { formatDate, toHtml } from '@announcing/components/utils';
  import VirtualScrollList from '@announcing/components/VirtualScrollList.svelte';
  import { LL } from '@announcing/i18n';

  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { fetchAnnouncement } from '$lib/fetch/fetchAnnouncement';

  import type { PageData } from './$types';
  import DeleteModal from './DeleteModal.svelte';

  export let data: PageData;

  let deleteModal: DeleteModal;
  let deleteTarget:
    | {
        id: string;
        updatedAt: number;
      }
    | undefined;

  let overflowMap: Record<string, boolean>;

  $: keys = data.channel.announcementIDs ?? [];
  $: if (typeof data !== 'undefined') {
    overflowMap = {};
  }

  const deleteAnnouncement = async () => {
    if (!deleteTarget) {
      return;
    }
    await fetch(`/api/channels/${data.channel.channelID}/announcements/${deleteTarget.id}`, {
      method: 'DELETE',
      body: JSON.stringify({ updatedAt: deleteTarget.updatedAt }),
    });

    await invalidateAll();
  };
</script>

<div class="container">
  <VirtualScrollList {keys} itemMinHeight={200} gap={8}>
    <div class="item" slot="item" let:key>
      {#await fetchAnnouncement({ channelID: data.channel.channelID, announcementID: key })}
        <Loading />
      {:then announcement}
        <ResizeObserver
          onResize={({ el }) => {
            overflowMap[key] = el.scrollHeight > el.clientHeight;
          }}
        >
          <div class="overflow-fade" class:overflow={overflowMap[key]}>
            <div class="top-box">
              <div class="date">
                {#if announcement.createdAt === announcement.updatedAt}
                  <div>{formatDate(announcement.createdAt)}</div>
                {:else}
                  <div>{$LL.announcementView.created()}{formatDate(announcement.createdAt)}</div>
                  <div>{$LL.announcementView.updated()}{formatDate(announcement.updatedAt)}</div>
                {/if}
              </div>
              <a class="button" href={`${$page.url.pathname.replace('list', key)}`}>
                {$LL.edit()}
              </a>
              <button
                on:click={() => {
                  deleteTarget = {
                    id: key,
                    updatedAt: announcement.updatedAt,
                  };
                  deleteModal.openModal();
                }}
              >
                {$LL.remove()}
              </button>
            </div>
            {#if announcement.headerImage}
              <img class="header-image" alt="header" use:imgSrc={announcement.headerImage} />
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

<DeleteModal bind:this={deleteModal} onSubmit={deleteAnnouncement} />

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
          background: linear-gradient(to top, var(--color-background), transparent 20%);
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
