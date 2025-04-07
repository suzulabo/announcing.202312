<script lang="ts">
  import ResizeObserver from '$lib/atoms/ResizeObserver.svelte';
  import type { Announcement } from '$lib/parts/AnnouncementView/AnnouncementView';
  import { formatDate } from '$lib/utils/formatDate';
  import { parseImageSize } from '$lib/utils/parseImageSize';

  interface Props {
    announcement: Announcement;
  }

  let { announcement }: Props = $props();

  let overflow = $state(false);

  const getAspectRatio = (src: string) => {
    const size = parseImageSize(src);
    return size ? `${size.width}/${size.height}` : 'auto';
  };
</script>

<ResizeObserver
  onResize={({ el }) => {
    overflow = el.scrollHeight > el.clientHeight;
  }}
>
  <div class="container" class:overflow>
    {#if announcement.headerImage}
      <img
        class="header-image"
        src={announcement.headerImage}
        style={`--aspect-radio: ${getAspectRatio(announcement.headerImage)}`}
        alt=""
      />
    {/if}
    <div class="date">{formatDate(announcement.createdAt)}</div>
    <div class="title-box">
      {#if announcement.title}
        <div class="title">{announcement.title}</div>
      {/if}
    </div>
    <div class="body">{announcement.body}</div>
  </div>
</ResizeObserver>

<style lang="scss">
  .container {
    max-height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 8px 8px 0;

    .header-image {
      display: block;
      max-height: 30dvh;
      aspect-ratio: var(--aspect-radio);
      object-fit: contain;
      border: none;
      border-radius: 4px;
      margin: 0 auto;
    }

    &.overflow:after {
      position: absolute;
      bottom: 0;
      top: 0;
      left: 0;
      right: 0;
      content: '';
      background: linear-gradient(to top, var(--color-background), transparent 10%);
      pointer-events: none;
    }

    .date {
      color: var(--color-text-light);
      font-size: 15px;
    }

    .title-box {
      display: flex;
      align-items: center;
      gap: 16px;

      .title {
        font-size: 18px;
        font-weight: bold;
      }
    }

    .body {
      white-space: pre-wrap;
    }
  }
</style>
