<script lang="ts">
  import ChannelPage from '@announcing/components/ChannelPage.svelte';
  import { LL } from '@announcing/components/i18n';
  import Modal from '@announcing/components/Modal.svelte';

  import type { PageData } from './$types';

  export let data: PageData;

  let deleteModal: Modal;
  let deleteUnderstand = false;
</script>

<div class="container">
  <div class="header">
    <button class="edit-btn">{$LL.edit()}</button>
    <button
      class="delete-btn"
      on:click={() => {
        deleteUnderstand = false;
        deleteModal.showModal();
      }}>{$LL.delete()}</button
    >
  </div>
</div>

<ChannelPage theme="default" channel={data.channel} channelPreview={true} />

<Modal bind:this={deleteModal} dismissMode="none">
  <div class="delete-modal">
    <span>{$LL.deleteChannel()}</span>
    <hr />
    <div class="warning">{$LL.deleteChannelDescription({ name: data.channel.title })}</div>
    <label class="understand-box">
      <input
        type="checkbox"
        bind:checked={deleteUnderstand}
        on:change={() => {
          console.log({ deleteUnderstand });
        }}
      />
      {$LL.deleteChannelUnderstand()}
    </label>

    <button
      class="delete-btn"
      disabled={!deleteUnderstand}
      on:click={() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (confirm($LL.deleteChannelConfirmation())) {
          console.log('do delete');
        }
      }}
    >
      {$LL.deleteChannel()}
    </button>

    <button
      class="text small"
      on:click={() => {
        deleteModal.closeModal();
      }}>{$LL.cancel()}</button
    >
  </div>
</Modal>

<style lang="scss">
  .container {
    padding: 8px;
    max-width: 1000px;

    .header {
      display: flex;
      .edit-btn {
        margin: 0 16px 0 auto;
      }
    }
  }

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
