<script lang="ts">
  import { LL } from '@announcing/i18n';

  import { pushState } from '$app/navigation';
  import { page } from '$app/stores';
  import { imgSrc } from '$lib/actions/imgSrc';
  import Modal from '$lib/atoms/Modal.svelte';
  import { formatDate } from '$lib/utils/formatDate';
  import { toHtml } from '$lib/utils/toHtml';

  import type { Announcement } from '../AnnouncementView.svelte';

  export let announcement: Announcement;

  let imageModalSrc: string | undefined;

  const showImageModal = (src: string) => {
    pushState('', { ...$page.state, announcementViewZoomImage: { src } });
  };

  $: imageModalSrc = $page.state.announcementViewZoomImage?.src;
</script>

<div class="container">
  {#if announcement.headerImage}
    <button
      class="unstyled"
      on:click={() => {
        if (announcement.headerImage) {
          showImageModal(announcement.headerImage);
        }
      }}
    >
      <img class="header-image" alt="" use:imgSrc={announcement.headerImage} />
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
    {#if announcement.images.length === 1}
      {@const image = announcement.images[0]}
      <div
        class="image-box"
        role="button"
        tabindex="0"
        on:click={() => {
          if (image) {
            showImageModal(image);
          }
        }}
        on:keydown={() => {
          // TODO
        }}
      >
        <img class="single-image" use:imgSrc={image} alt="" />
      </div>
    {:else}
      <div class="images-grid">
        {#each announcement.images as image}
          <div
            role="button"
            tabindex="0"
            class="image-box"
            on:click={() => {
              showImageModal(image);
            }}
            on:keydown={() => {
              // TODO
            }}
          >
            <img use:imgSrc={image} alt="" />
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<Modal
  open={!!imageModalSrc}
  dismissMode="anywhere"
  on:dismiss={() => {
    const src = $page.state.announcementViewZoomImage?.src;
    if (src) {
      history.back();
    }
  }}
>
  <div class="zoom-image"><img use:imgSrc={imageModalSrc} alt="" /></div>
</Modal>

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .header-image {
      max-height: 40vh;
      align-self: center;
      margin: 0 0 16px 0;
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

    .image-box {
      display: contents;
      cursor: pointer;
    }

    .single-image {
      object-fit: cover;
      margin: 8px auto;
      border-radius: 8px;
      max-height: 50vh;
    }
    .images-grid {
      display: grid;
      grid-template-columns: auto auto;
      gap: 4px;
      padding: 8px 4px;

      img {
        aspect-ratio: 5/4;
        object-fit: cover;
        margin: auto;
        border-radius: 8px;
      }
    }
  }

  .zoom-image {
    display: flex;
    margin: auto;
    width: fit-content;
    height: fit-content;
    max-width: 100%;
    max-height: 100%;
    overflow: hidden;
    img {
      object-fit: contain;
    }
  }
</style>
