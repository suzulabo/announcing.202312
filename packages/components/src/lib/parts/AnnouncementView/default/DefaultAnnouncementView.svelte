<script lang="ts" context="module">
  export type Announcement = {
    headerImage?: string | undefined;
    title?: string | undefined;
    body: string;
    images?: string[] | undefined;
    updatedAt: Date;
    createdAt: Date;
  };
</script>

<script lang="ts">
  import { pushState } from '$app/navigation';
  import { page } from '$app/stores';
  import { imgSrc } from '$lib/actions/imgSrc';
  import Modal from '$lib/atoms/Modal.svelte';
  import { LL } from '$lib/i18n';
  import { formatDate } from '$lib/utils/formatDate';
  import { toHtml } from '$lib/utils/toHtml';

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
    {#if announcement.createdAt.getTime() === announcement.updatedAt.getTime()}
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
      <button
        class="unstyled"
        on:click={() => {
          if (image) {
            showImageModal(image);
          }
        }}
      >
        <img class="single-image" use:imgSrc={image} alt="" />
      </button>
    {:else}
      <div class="images-grid">
        {#each announcement.images as image}
          <button
            class="unstyled"
            on:click={() => {
              showImageModal(image);
            }}
          >
            <img use:imgSrc={image} alt="" />
          </button>
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
    max-width: 600px;
    margin: 0 auto 100px;
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
      :global(a) {
        padding: 0;
        font-weight: normal;
        text-decoration: underline;
      }
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
        aspect-ratio: 1;
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
