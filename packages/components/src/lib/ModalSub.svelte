<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';

  export let closeAnywhere = false;

  const closeDispatch = createEventDispatcher();
  const handleClose = () => {
    closeDispatch('close');
  };

  history.pushState(undefined, '', '#modal');

  let bodyOverflow: string;

  onMount(() => {
    bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  });

  onDestroy(() => {
    document.body.style.overflow = bodyOverflow;

    if (location.hash === '#modal') {
      history.back();
    }
  });
</script>

<button
  class={`unstyled modal`}
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
