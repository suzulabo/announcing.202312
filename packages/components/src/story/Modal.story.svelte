<script lang="ts">
  import type { Hst } from '@histoire/plugin-svelte';

  import Modal from '$lib/Modal.svelte';

  // eslint-disable-next-line no-import-assign
  export let Hst: Hst;

  let show = false;
</script>

<Hst.Story title="Modal">
  <button on:click={() => (show = true)}>Show</button>
  <Modal
    bind:show
    on:close={() => {
      show = false;
    }}
  >
    <div class="modal-body">
      <div>This is a modal window.</div>
      <button on:click={() => (show = false)}>Close</button>
    </div>
  </Modal>
</Hst.Story>

<style lang="scss">
  .modal-body {
    padding: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
</style>
