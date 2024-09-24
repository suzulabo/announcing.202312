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
  import Modal from '$lib/atoms/Modal.svelte';
  import { LL } from '$lib/i18n';
  import { formatDate } from '$lib/utils/formatDate';
  import { toHtml } from '$lib/utils/toHtml';

  export let announcement: Announcement;

  let imageModal: Modal;
  let imageModalSrc: string | undefined;
</script>

<div class="container">
  {#if announcement.headerImage}
    <button
      class="unstyled"
      on:click={() => {
        imageModalSrc = announcement.headerImage;
        imageModal.showModal();
      }}
    >
      <img class="header-image" alt="" src={announcement.headerImage} />
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
    <div class="images-grid">
      {#each announcement.images as image}
        <button
          class="unstyled"
          on:click={() => {
            imageModalSrc = image;
            imageModal.showModal();
          }}
        >
          <img src={image} alt="" />
        </button>
      {/each}
    </div>
  {/if}
</div>

<Modal bind:this={imageModal} modalID="AnnouncementImage" dismissMode="anywhere">
  <div class="zoom-image"><img src={imageModalSrc} alt="" /></div>
</Modal>

<style lang="scss">
  .container {
    max-width: 600px;
    margin: 0 auto;
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
