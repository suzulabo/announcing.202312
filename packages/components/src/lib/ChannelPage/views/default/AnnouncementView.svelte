<script lang="ts">
  import { overflow } from '$lib/actions/overflow';
  import type { Announcement } from '$lib/ChannelPage/types';
  import { formatDate } from '$lib/utils/formatDate';
  import { parseImageSrc } from '$lib/utils/parseImageSrc';

  export let announcement: Announcement;
</script>

<div class="container overflowing-y" use:overflow>
  <div class="date">{formatDate(announcement.createdAt)}</div>
  {#if announcement.headerImage}
    <img
      class="header-image"
      alt=""
      {...parseImageSrc(announcement.headerImage, { height: 100 })}
    />
  {/if}
  {#if announcement.title}
    <div class="title">{announcement.title}</div>
  {/if}
  <div class="body">{announcement.body}</div>
</div>

<style lang="scss">
  .container {
    max-height: 100%;
    margin: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;

    &.overflowing-y:after {
      position: absolute;
      bottom: 0;
      top: 0;
      left: 0;
      right: 0;
      content: '';
      background: linear-gradient(
        to top,
        rgba(var(--color-background-rgb), 1),
        rgba(var(--color-text-rgb), 0) 20%
      );
      pointer-events: none;
    }

    .header-image {
      object-fit: contain;
      border-radius: 4px;
      align-self: center;
    }
    .title {
      font-size: 1.1em;
      font-weight: bold;
    }
  }
</style>
