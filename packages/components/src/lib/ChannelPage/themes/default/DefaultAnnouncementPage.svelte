<script lang="ts">
  import type { Announcement, Channel } from '$lib/ChannelPage/types';
  import Modal from '$lib/Modal.svelte';
  import { formatDate } from '$lib/utils/formatDate';
  import { parseImageSize } from '$lib/utils/parseImageSize';
  import { toStyle } from '$lib/utils/toStyle';

  export let channel: Channel;
  export let announcement: Announcement;
  export let backURL: string | undefined;

  let showImageModal = false;
  let imageModalSrc: string | undefined;

  const getAspectRatio = (src: string) => {
    const size = parseImageSize(src);
    if (!size) {
      return;
    }

    return { 'aspect-ratio': `${size.width}/${size.height}` };
  };
</script>

<div class="container">
  <a class="header" href={backURL}>
    <span class="arrow">←</span>
    <span class="title">{channel.title}</span>
    {#if channel.icon}
      <img class="icon" src={channel.icon} alt={channel.title} />
    {/if}
  </a>
  <hr />
  <div class="announcement">
    <div class="date">{formatDate(announcement.createdAt)}</div>
    {#if announcement.headerImage}
      <div class="header-image-box" style={toStyle(getAspectRatio(announcement.headerImage))}>
        <button
          class="unstyled"
          on:click={() => {
            imageModalSrc = announcement.headerImage;
            showImageModal = true;
          }}
        >
          <img src={announcement.headerImage} alt="" />
        </button>
      </div>
    {/if}
    {#if announcement.title}
      <div class="title">{announcement.title}</div>
    {/if}
    <div class="body">{announcement.body}</div>
  </div>
</div>

<Modal bind:show={showImageModal} dismissMode="anywhere">
  <div class="zoom-image"><img src={imageModalSrc} alt="" /></div>
</Modal>

<style lang="scss">
  .container {
    padding: 8px;
    max-width: 600px;
    margin: 10px auto;

    .header {
      display: flex;
      align-items: center;
      .arrow {
        font-size: 18px;
        margin: 0 24px 0 0;
      }
      .title {
        font-weight: bold;
        font-size: 18px;
        flex-grow: 1;
        text-align: right;
      }
      .icon {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        object-fit: contain;
        margin: 0 0 0 12px;
      }
    }

    hr {
      margin: 20px 0;
    }

    .announcement {
      margin: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 16px;
      .header-image-box {
        width: 100%;
        max-height: 300px;
        text-align: center;
        img {
          object-fit: contain;
          border-radius: 4px;
        }
      }
      .title {
        font-size: 20px;
        font-weight: bold;
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
