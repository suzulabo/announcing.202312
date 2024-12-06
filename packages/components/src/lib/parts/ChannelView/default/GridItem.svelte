<script lang="ts">
  import { imgSrc } from '$lib/actions/imgSrc';
  import ResizeObserver from '$lib/atoms/ResizeObserver.svelte';
  import type { Announcement } from '$lib/parts/AnnouncementView/AnnouncementView.svelte';
  import { formatDate } from '$lib/utils/formatDate';
  import { parseImageSize } from '$lib/utils/parseImageSize';
  import { toStyle } from '$lib/utils/toStyle';

  interface Props {
    announcement: Announcement;
  }

  let { announcement }: Props = $props();

  let overflow = $state(false);

  const getAspectRatio = (src: string) => {
    const size = parseImageSize(src);
    if (!size) {
      return;
    }

    return { 'aspect-ratio': `${size.width}/${size.height}` };
  };
</script>

<ResizeObserver
  onResize={({ el }) => {
    overflow = el.scrollHeight > el.clientHeight;
  }}
>
  <div class="container" class:overflow>
    <div class="date">{formatDate(announcement.createdAt)}</div>
    {#if announcement.headerImage}
      <div class="header-image-box" style={toStyle(getAspectRatio(announcement.headerImage))}>
        <img use:imgSrc={announcement.headerImage} alt="" />
      </div>
    {/if}
    {#if announcement.title}
      <div class="title">{announcement.title}</div>
    {/if}
    <div class="body">{announcement.body}</div>
    {#if announcement.images}
      {#if announcement.images.length === 1}
        {@const image = announcement.images[0]}
        <img class="single-image" use:imgSrc={image} alt="" />
      {:else}
        <div class="images-grid">
          {#each announcement.images as image}
            <img use:imgSrc={image} alt="" />
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</ResizeObserver>

<style lang="scss">
  .container {
    flex-grow: 1;
    max-height: 100%;
    margin: 8px 0 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;

    &.overflow:after {
      position: absolute;
      bottom: 0;
      top: 0;
      left: 0;
      right: 0;
      content: '';
      background: linear-gradient(to top, var(--color-gradient), transparent 10%);
      pointer-events: none;
    }

    .date {
      color: var(--color-text-light);
      font-size: 15px;
    }

    .header-image-box {
      width: 100%;
      max-height: 100px;
      text-align: center;
      img {
        object-fit: contain;
        border-radius: 4px;
      }
    }

    .title {
      font-size: 18px;
      font-weight: bold;
    }

    .body {
      white-space: pre-wrap;
    }

    .single-image {
      object-fit: contain;
      margin: 8px auto;
      border-radius: 8px;
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
</style>
