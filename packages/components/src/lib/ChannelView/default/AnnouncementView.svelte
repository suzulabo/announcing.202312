<script lang="ts">
  import { getContext } from 'svelte';

  import Spinner from '$lib/Spinner.svelte';
  import { formatDate } from '$lib/utils/formatDate';
  import { toHtml } from '$lib/utils/toHtml';

  import type { AnnouncementViewParams } from '../types';
  import { type ShowImageModalContext, showImageModalContextKey } from './lib';

  export let params: AnnouncementViewParams;

  $: announcement = params.announcement;

  const showImageModal = getContext<ShowImageModalContext>(showImageModalContextKey);

  const imgClick = (event: MouseEvent) => {
    const src = (event.currentTarget as HTMLButtonElement).getAttribute('data-src');
    if (src) {
      showImageModal(src);
    }
  };
</script>

<div class="announcement">
  {#if !announcement}
    <div class="loading">
      <Spinner />
    </div>
  {:else}
    <div class="published">{formatDate(announcement.updatedAt)}</div>
    {#if announcement.headerImage}
      <div class="header-image">
        <button class="unstyled" data-src={announcement.headerImage} on:click={imgClick}>
          <img src={announcement.headerImage} alt={announcement.title} />
        </button>
      </div>
    {/if}
    {#if announcement.title}
      <div class="title">{announcement.title}</div>
    {/if}
    {#if announcement.body}
      <div class="body">{@html toHtml(announcement.body)}</div>
    {/if}
    {#if announcement.images}
      <div class={`images size-${announcement.images.length.toString()}`}>
        {#each announcement.images as image}
          <button class="unstyled" data-src={image} on:click={imgClick}>
            <img src={image} alt={announcement.title} />
          </button>
        {/each}
      </div>
    {/if}
  {/if}
</div>
<hr />

<style lang="scss">
  .announcement {
    padding: 0 10px;
    min-height: 100px;
    display: flex;
    flex-direction: column;

    .loading {
      margin: auto;
    }

    .header-image {
      margin: 16px 0 0;
      text-align: center;
      img {
        border-radius: 4px;
        max-height: 200px;
      }
    }
    .title {
      font-size: 18px;
      font-weight: bold;
      margin: 16px 0 0;
    }
    .body {
      white-space: pre-line;
      margin: 16px 0 0;
    }
    .images {
      margin: 16px 0 0;
      display: grid;
      gap: 4px;
      grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      img {
        height: 170px;
        width: 100%;
        object-fit: cover;
        border-radius: 4px;
      }

      &.size-1 {
        img {
          margin: auto;
          width: auto;
          height: auto;
          max-height: 200px;
          object-fit: contain;
        }
      }
    }
  }

  hr {
    margin: 20px 0;
  }
</style>
