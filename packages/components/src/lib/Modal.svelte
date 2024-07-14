<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let show = false;
  export let closeAnywhere = false;
  export let closeOnBack = false;

  const closeDispatch = createEventDispatcher();
  const handleClose = () => {
    closeDispatch('close');
  };

  $: {
    if (closeOnBack) {
      if (show) {
        history.pushState(undefined, '', '#modal');
      } else if (location.hash === '#modal') {
        history.back();
      }
    }
  }
</script>

{#if show}
  <button
    class="unstyled modal"
    on:click={() => {
      if (closeAnywhere) handleClose();
    }}
    on:click|self={() => {
      if (!closeAnywhere) handleClose();
    }}
  >
    <slot />
  </button>
{/if}

<svelte:window
  on:keydown={(event) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  }}
  on:popstate={() => {
    console.log('popstate', location.hash);
    if (closeOnBack) {
      if (show) {
        handleClose();
      } else if (location.hash === '#modal') {
        history.back();
      }
    }
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
