<script lang="ts" context="module">
  const isIframe = typeof window === 'object' && window.self !== window.top;
</script>

<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';

  export let dismissMode: 'backdrop' | 'anywhere' | 'none' = 'backdrop';
  export let padding = '0';

  const dismissDispatch = createEventDispatcher();
  const handleClose = () => {
    dismissDispatch('dismiss');
  };

  let bodyOverflow: string;

  onMount(() => {
    if (!isIframe && location.hash !== '#modal') {
      history.pushState(undefined, '', '#modal');
    }
    bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  });

  onDestroy(() => {
    if (!isIframe && location.hash === '#modal') {
      history.back();
    }
    document.body.style.overflow = bodyOverflow;
  });
</script>

<button
  class={`unstyled modal`}
  style={`--padding: ${padding}`}
  on:click={() => {
    if (dismissMode === 'anywhere') handleClose();
  }}
  on:click|self={() => {
    if (dismissMode === 'backdrop') handleClose();
  }}
>
  <slot />
</button>

<svelte:window
  on:keydown={(event) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  }}
  on:popstate={() => {
    handleClose();
  }}
/>

<style lang="scss">
  .modal {
    cursor: default;
    display: flex;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    padding: var(--padding);
    background-color: var(--color-background-modal);
    backdrop-filter: blur(1px);
    z-index: var(--modal-z-index, 999);
  }
</style>
