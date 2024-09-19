<script lang="ts">
  import Modal from '$lib/Modal.svelte';

  let modal: Modal;
</script>

<div class="container">
  <button
    on:click={() => {
      modal.showModal();
    }}>Show</button
  >
</div>
<Modal modalID="basic" bind:this={modal}>
  <div class="modal-body">
    <div>This is a modal window.</div>
    <button
      on:click={() => {
        modal.closeModal();
      }}>Close</button
    >
  </div>
</Modal>

<style lang="scss">
  .container {
    text-align: center;
    padding: 30vh;
  }

  .modal-body {
    background-color: var(--color-background);
    border-radius: 8px;
    margin: auto;
    padding: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
</style>
