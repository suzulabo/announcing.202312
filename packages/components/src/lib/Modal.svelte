<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let show = false;
  export let closeAnywhere = false;

  const closeDispatch = createEventDispatcher();
  const handleClose = () => {
    closeDispatch('close');
  };
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
