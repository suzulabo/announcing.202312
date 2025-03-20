<script lang="ts">
  import ResizeObserver from '$lib/atoms/ResizeObserver.svelte';
  import type { Announcement } from '$lib/parts/AnnouncementView/AnnouncementView.svelte';
  import { formatDate } from '$lib/utils/formatDate';

  interface Props {
    announcement: Announcement;
  }

  let { announcement }: Props = $props();

  let overflow = $state(false);
</script>

<ResizeObserver
  onResize={({ el }) => {
    overflow = el.scrollHeight > el.clientHeight;
  }}
>
  <div class="container" class:overflow>
    <div class="date">{formatDate(announcement.createdAt)}</div>
    <div class="title-box">
      {#if announcement.headerImage}
        <img src={announcement.headerImage} alt="" />
      {/if}
      {#if announcement.title}
        <div class="title">{announcement.title}</div>
      {/if}
    </div>
    <div class="body">{announcement.body}</div>
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

    .title-box {
      display: flex;
      align-items: center;
      gap: 16px;

      img {
        margin: auto;
        max-height: 100px;
        max-width: 30%;
        border-radius: 4px;
      }

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
