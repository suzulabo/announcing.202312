<script lang="ts">
  import ResizeObserver from '$lib/atoms/ResizeObserver.svelte';
  import type { Announcement } from '$lib/parts/AnnouncementView/AnnouncementView.svelte';
  import { formatDate } from '$lib/utils/formatDate';
  import { parseImageSize } from '$lib/utils/parseImageSize';
  import { toStyle } from '$lib/utils/toStyle';

  export let announcement: Announcement;

  let overflow = false;

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
        <img src={announcement.headerImage} alt="" />
      </div>
    {/if}
    {#if announcement.title}
      <div class="title">{announcement.title}</div>
    {/if}
    <div class="body">{announcement.body}</div>
  </div>
</ResizeObserver>

<style lang="scss">
  .container {
    max-height: 100%;
    margin: 8px 0 0;
    padding: 8px;
    border-radius: 8px;
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
      background: linear-gradient(to top, var(--color-background), transparent 20%);
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

    @media (hover: hover) {
      &:hover {
        background-color: var(--color-hover);
      }
    }
  }
</style>
