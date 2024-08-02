<script lang="ts" context="module">
  import { Story } from '@storybook/addon-svelte-csf';
  import type { Meta } from '@storybook/svelte';

  import Modal from '$lib/Modal.svelte';

  export const meta = {
    title: 'Modal',
    component: Modal,
    tags: ['autodocs'],
  } satisfies Meta<Modal>;
</script>

<script lang="ts">
  let show = false;
</script>

<Story name="Basic">
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
</Story>

<style lang="scss">
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
