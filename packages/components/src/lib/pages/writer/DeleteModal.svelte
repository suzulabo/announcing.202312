<script lang="ts">
  import { LL } from '$lib/i18n';
  import Modal from '$lib/Modal.svelte';

  export let name: string;
  export let deleteClick: () => void;

  let modal: Modal;
  let deleteUnderstand: boolean;

  export const showModal = () => {
    deleteUnderstand = false;
    modal.showModal();
  };
</script>

<Modal bind:this={modal} dismissMode="none">
  <div class="delete-modal">
    <span>{$LL.deleteChannel()}</span>
    <hr />
    <div class="warning">{$LL.deleteChannelDescription({ name: name })}</div>
    <label class="understand-box">
      <input type="checkbox" bind:checked={deleteUnderstand} />
      {$LL.deleteChannelUnderstand()}
    </label>

    <button
      class="delete-btn"
      disabled={!deleteUnderstand}
      on:click={() => {
        if (confirm($LL.deleteChannelConfirmation())) {
          modal.closeModal();
          deleteClick();
        }
      }}
    >
      {$LL.deleteChannel()}
    </button>

    <button
      class="text small"
      on:click={() => {
        modal.closeModal();
      }}>{$LL.cancel()}</button
    >
  </div>
</Modal>

<style lang="scss">
  .delete-modal {
    background-color: var(--color-background);
    border-radius: 8px;
    margin: auto;
    padding: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    hr {
      margin: -8px 0 0;
    }

    .warning {
      font-weight: bold;
      color: var(--color-error);
    }
  }
</style>
