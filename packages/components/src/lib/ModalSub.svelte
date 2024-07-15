<script lang="ts" context="module">
  import { writable } from 'svelte/store';

  const MODAL_MARKER = '__modal__';

  export const modalHashWatcher = writable(undefined, () => {
    const popstateListener = () => {
      // Block going to URL with #modal on forward
      if (location.hash === '#modal' && !document.querySelector(MODAL_MARKER)) {
        history.back();
      }
    };

    window.addEventListener('popstate', popstateListener);

    return () => {
      window.removeEventListener('popstate', popstateListener);
    };
  });
</script>

<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';

  export let closeAnywhere = false;

  const closeDispatch = createEventDispatcher();
  const handleClose = () => {
    closeDispatch('close');
  };

  history.pushState(undefined, '', '#modal');

  onDestroy(() => {
    if (location.hash === '#modal') {
      history.back();
    }
  });
</script>

<button
  class={`unstyled modal ${MODAL_MARKER}`}
  on:click={() => {
    if (closeAnywhere) handleClose();
  }}
  on:click|self={() => {
    if (!closeAnywhere) handleClose();
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
    display: flex;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    background-color: var(--color-background-modal);
    backdrop-filter: blur(1px);
    z-index: var(--modal-z-index, 999);
  }
</style>
