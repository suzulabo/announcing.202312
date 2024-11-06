<script lang="ts">
  import Modal from '$lib/atoms/Modal.svelte';

  let open = false;
</script>

<div class="container">
  <button
    on:click={() => {
      open = true;
    }}>Open</button
  >
</div>
<Modal bind:open>
  <div class="modal-body">
    <div>
      This is a test modal for verifying the component’s functionality. Please review the layout and
      interactions. Close the modal when you’re done.
    </div>
    <button
      on:click={() => {
        open = false;
      }}>Close</button
    >
  </div>
</Modal>

<style lang="scss">
  .container {
    text-align: center;
    padding: 30vh 0;
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
