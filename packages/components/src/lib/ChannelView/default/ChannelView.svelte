<script lang="ts" context="module">
  import resetCss from '$lib/reset.scss?inline';

  const baseCssAction: Action = (el) => {
    const style = document.createElement('style');
    style.innerHTML = resetCss;
    el.insertAdjacentElement('beforebegin', style);
  };
</script>

<script lang="ts">
  import { setContext } from 'svelte';
  import type { Action } from 'svelte/action';

  import Modal from '$lib/Modal.svelte';
  import { toHtml } from '$lib/utils/toHtml';

  import type { ChannelViewParams } from '../types';
  import { type ShowImageModalContext, showImageModalContextKey } from './lib';

  export let params: ChannelViewParams;

  $: ({ channel, noAnnouncements, msgs } = params);

  let imageModalSrc: string | undefined = undefined;

  const showImageModal = (src: string) => {
    imageModalSrc = src;
  };

  setContext<ShowImageModalContext>(showImageModalContextKey, showImageModal);
</script>

<div class="settings">
  <button on:click={params.settingsClick}>{msgs.settings}</button>
</div>
<div class="main" use:baseCssAction>
  <div class="name-line">
    <div class="name">
      {channel.title}
    </div>
    {#if channel.icon}
      <img class="icon" src={channel.icon} alt={channel.title} />
    {/if}
  </div>
  {#if channel.desc}
    <div class="desc">
      {@html toHtml(channel.desc)}
    </div>
  {/if}
  {#if channel.links}
    {#each channel.links as link}
      <div class="link">
        <a href={link.url}>{link.name}</a>
      </div>
    {/each}
  {/if}
  <hr />
  {#if noAnnouncements}
    <div class="no-announcements">
      {msgs.noAnnouncements}
    </div>
  {:else}
    <slot />
  {/if}
</div>

<Modal
  show={!!imageModalSrc}
  closeAnywhere={true}
  on:close={() => {
    imageModalSrc = undefined;
  }}
>
  <div class="zoom-image"><img src={imageModalSrc} alt="" /></div>
</Modal>

<style lang="scss">
  .settings {
    text-align: right;
  }
  .main {
    min-height: 100vh;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px 10px;

    animation: fadeIn 0.5s;

    .name-line {
      margin: 10px 0 0;
      display: flex;
      align-items: center;
      .name {
        font-weight: bold;
        font-size: 24px;
        flex-grow: 1;
      }
      .icon {
        width: 64px;
        height: 64px;
        border-radius: 8px;
        object-fit: contain;
      }
    }

    .desc {
      margin: 10px 5px 0;
      white-space: pre-line;
    }

    .link {
      margin: 10px 5px 0;
    }

    hr {
      margin: 20px 0;
    }

    .no-announcements {
      text-align: center;
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

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>
