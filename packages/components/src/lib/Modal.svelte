<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let show = false;

  const closeDispatch = createEventDispatcher();
  const handleClose = () => {
    closeDispatch('close');
  };
</script>

{#if show}
  <!-- svelte-ignore a11y-click-events-have-key-events  -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal" on:click|self={handleClose}>
    <div class="modal-content"><slot /></div>
  </div>
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
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    background-color: var(--color-background-modal);
    backdrop-filter: blur(1px);
    z-index: var(--modal-z-index, 999);

    padding: 8px;
    display: flex;

    .modal-content {
      background-color: var(--color-background);
      border-radius: 4px;
      margin: auto;
    }
  }
</style>
