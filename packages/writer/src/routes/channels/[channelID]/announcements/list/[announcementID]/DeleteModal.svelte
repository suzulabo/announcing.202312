<script lang="ts">
  import Loading from '@announcing/components/Loading.svelte';
  import Modal from '@announcing/components/Modal.svelte';
  import { LL } from '@announcing/i18n';

  export let onSubmit: () => Promise<void>;

  export const openModal = () => {
    deleteUnderstand = false;
    open = true;
    loading = false;
  };

  let open = false;
  let deleteUnderstand: boolean;
  let loading = false;

  const submitHandler = async () => {
    if (!confirm($LL.deleteAnnouncement.confirmation())) {
      return;
    }

    loading = true;
    try {
      await onSubmit();
      open = false;
    } finally {
      loading = false;
    }
  };
</script>

<Modal bind:open dismissMode="none">
  <div class="delete-modal">
    <span>{$LL.deleteAnnouncement.title()}</span>
    <hr />
    <div class="warning">{$LL.deleteAnnouncement.description()}</div>
    <label class="understand-box">
      <input type="checkbox" bind:checked={deleteUnderstand} />
      {$LL.understand()}
    </label>

    <button class="delete-btn" disabled={!deleteUnderstand} on:click={submitHandler}>
      {$LL.deleteAnnouncement.title()}
    </button>

    <button
      class="small filled"
      on:click={() => {
        open = false;
      }}>{$LL.cancel()}</button
    >
  </div>
</Modal>

<Loading show={loading} />

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
      padding: 0 8px;
    }
  }
</style>
