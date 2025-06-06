<script lang="ts">
  import { pushState } from '$app/navigation';
  import { page } from '$app/state';
  import Modal from '$lib/atoms/Modal.svelte';
  import { formatDate } from '$lib/utils/formatDate';
  import { toHtml } from '$lib/utils/toHtml';
  import { LL } from '@announcing/i18n';
  import type { ComponentProps } from 'svelte';
  import AnnouncementView from '../AnnouncementView.svelte';
  import { parseImageSize } from '$lib/utils/parseImageSize';

  type Announcement = ComponentProps<typeof AnnouncementView>['announcement'];

  interface Props {
    announcement: Announcement;
  }

  let { announcement }: Props = $props();

  let imageModalSrc: string | undefined = $derived(page.state.announcementViewZoomImage?.src);

  const showImageModal = (src: string) => {
    pushState('', { ...page.state, announcementViewZoomImage: { src } });
  };
</script>

<div class="container">
  {#if announcement.headerImage}
    <button
      class="unstyled"
      onclick={() => {
        if (announcement.headerImage) {
          showImageModal(announcement.headerImage);
        }
      }}
    >
      <img
        class="header-image"
        alt=""
        src={announcement.headerImage}
        {...parseImageSize(announcement.headerImage)}
      />
    </button>
  {/if}
  <div class="date">
    {#if announcement.createdAt === announcement.updatedAt}
      <div>{formatDate(announcement.createdAt)}</div>
    {:else}
      <div>{$LL.announcementView.created()}{formatDate(announcement.createdAt)}</div>
      <div>{$LL.announcementView.updated()}{formatDate(announcement.updatedAt)}</div>
    {/if}
  </div>
  {#if announcement.title}
    <div class="title">
      {announcement.title}
    </div>
  {/if}
  <div class="body">
    {@html toHtml(announcement.body)}
  </div>
  {#if announcement.images}
    <div class="images-box">
      {#if announcement.images.length === 1}
        {@const image = announcement.images[0] as string}
        <div
          class="image-box"
          role="button"
          tabindex="0"
          onclick={() => {
            if (image) {
              showImageModal(image);
            }
          }}
          onkeydown={() => {
            // TODO
          }}
        >
          <img class="single-image" src={image} alt="" {...parseImageSize(image)} />
        </div>
      {:else}
        <div class="images-grid">
          {#each announcement.images as image (image)}
            <div
              role="button"
              tabindex="0"
              class="image-box"
              onclick={() => {
                showImageModal(image);
              }}
              onkeydown={() => {
                // TODO
              }}
            >
              <img src={image} alt="" {...parseImageSize(image)} />
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<Modal
  open={!!imageModalSrc}
  dismissMode="anywhere"
  onDismiss={() => {
    const src = page.state.announcementViewZoomImage?.src;
    if (src) {
      history.back();
    }
  }}
>
  <img class="zoom-image" src={imageModalSrc} alt="" {...parseImageSize(imageModalSrc as string)} />
</Modal>

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .header-image {
      max-height: 50vh;
      align-self: center;
      margin: 0 0 8px 0;
      object-fit: contain;
      width: fit-content;
      height: fit-content;
    }
    .date {
      padding: 0 8px;
      color: var(--color-text-light);
      font-size: 14px;
    }
    .title {
      font-size: 24px;
      padding: 0 8px;
    }
    .body {
      padding: 0 16px;
      white-space: pre-wrap;
      line-height: 1.4;
    }

    .images-box {
      margin: 8px 4px;
      display: flex;

      .image-box {
        display: contents;
        cursor: pointer;
      }

      .single-image {
        margin: 0 auto;
        object-fit: contain;
        max-height: 90vh;
        width: fit-content;
        height: fit-content;
      }

      .images-grid {
        display: grid;
        grid-template-columns: auto auto;
        gap: 4px;

        .image-box {
          aspect-ratio: 1;
          display: flex;
        }

        img {
          aspect-ratio: 1;
          object-fit: cover;
          border-radius: 4px;
          margin: auto;
        }
      }
    }
  }

  .zoom-image {
    margin: auto;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    width: fit-content;
    height: fit-content;
  }
</style>
