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
  import { LL } from '$lib/i18n';
  import { formatDate } from '$lib/utils/formatDate';
  import { toHtml } from '$lib/utils/toHtml';

  export let announcement: Announcement;
</script>

<div class="container">
  {#if announcement.headerImage}
    <img class="header-image" alt="" src={announcement.headerImage} />
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
        <img src={image} alt="" />
      {/each}
    </div>
  {/if}
</div>

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
</style>
