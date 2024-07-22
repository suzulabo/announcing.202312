<script lang="ts">
  import { format } from 'date-fns';
  import linkifyHtml from 'linkify-html';

  import Modal from '$lib/Modal.svelte';
  import Spinner from '$lib/Spinner.svelte';

  import type { AnnouncementViewParams } from '../types';

  export let params: AnnouncementViewParams;

  $: announcement = params.announcement;

  let modalImage: string | undefined = undefined;

  const formatDate = (n: Date) => {
    return format(n, 'yyyy-MM-dd HH:mm');
  };

  const toHtml = (s: string) => {
    return linkifyHtml(s, {
      defaultProtocol: 'https',
      target: '_blank',
      rel: 'nofollow noreferrer',
    });
  };

  const imgClick = (src: string) => {
    return () => {
      modalImage = src;
    };
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
        <button class="unstyled" on:click={imgClick(announcement.headerImage)}>
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
          <button class="unstyled" on:click={imgClick(image)}>
            <img src={image} alt={announcement.title} />
          </button>
        {/each}
      </div>
    {/if}
  {/if}
</div>
<hr />

<Modal
  show={!!modalImage}
  closeAnywhere={true}
  on:close={() => {
    modalImage = undefined;
  }}
>
  <div class="zoom-image"><img src={modalImage} alt="" /></div>
</Modal>

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
