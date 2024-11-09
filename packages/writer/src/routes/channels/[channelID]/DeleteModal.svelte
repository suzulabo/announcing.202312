<script lang="ts">
  import Loading from '@announcing/components/Loading.svelte';
  import Modal from '@announcing/components/Modal.svelte';
  import { LL } from '@announcing/i18n';

  interface Props {
    name: string;
    onSubmit: () => Promise<void>;
  }

  let { name, onSubmit }: Props = $props();

  export const openModal = () => {
    deleteUnderstand = false;
    open = true;
    loading = false;
  };

  let open = $state(false);
  let deleteUnderstand = $state(false);
  let loading = $state(false);

  const submitHandler = async () => {
    if (!confirm($LL.deleteChannelConfirmation())) {
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

<Modal bind:open dismissMode="backdrop">
  <div class="delete-modal">
    <span>{$LL.deleteChannel()}</span>
    <hr />
    <div class="warning">{$LL.deleteChannelDescription({ name: name })}</div>
    <label class="understand-box">
      <input type="checkbox" bind:checked={deleteUnderstand} />
      {$LL.understand()}
    </label>

    <button class="delete-btn" disabled={!deleteUnderstand} onclick={submitHandler}>
      {$LL.deleteChannel()}
    </button>

    <button
      class="filled small"
      onclick={() => {
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
    padding: 8px 8px 16px;
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
