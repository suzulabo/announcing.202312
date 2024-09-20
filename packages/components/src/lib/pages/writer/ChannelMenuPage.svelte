<script lang="ts" context="module">
  export type Channel = {
    id: string;
    name: string;
    icon: string | undefined;
  };
</script>

<script lang="ts">
  import { LL } from '$lib/i18n';
  import Loading from '$lib/Loading.svelte';
  import Modal from '$lib/Modal.svelte';

  export let channel: Channel;
  export let readerPrefix: string;

  let deleteModal: Modal;
  let deleteUnderstand = false;
  let loading = false;

  const deleteChannel = () => {
    loading = true;
    try {
      //
    } finally {
      loading = false;
    }
  };
</script>

<div class="container">
  <div class="header">
    <a href="/">{$LL.back()}</a>
  </div>

  <div class="name-box">
    <span class="name">{channel.name}</span>
    {#if channel.icon}
      <img class="icon" src={channel.icon} alt="channel icon" />
    {/if}
  </div>

  <hr />

  <div class="actions-instruction">{$LL.channelActions.instruction()}</div>

  <ul class="actions">
    <li>
      <a href={`${readerPrefix}${channel.id}`}>{$LL.channelActions.viewChannel()}</a>
    </li>
    <li>
      <button class="text">{$LL.channelActions.copyURL()}</button>
    </li>
    <li>
      <button class="text">{$LL.channelActions.createAnnouncement()}</button>
    </li>
    <li>
      <button class="text">{$LL.channelActions.editAnnouncement()}</button>
    </li>
    <li>
      <button class="text">{$LL.channelActions.editChannel()}</button>
    </li>
    <hr />
    <li>
      <button
        class="text"
        on:click={() => {
          deleteUnderstand = false;
          deleteModal.showModal();
        }}>{$LL.channelActions.deleteChannel()}</button
      >
    </li>
  </ul>
</div>

<Modal bind:this={deleteModal} dismissMode="none" padding="8px">
  <div class="delete-modal">
    <span>{$LL.deleteChannel()}</span>
    <hr />
    <div class="warning">{$LL.deleteChannelDescription({ name: channel.name })}</div>
    <label class="understand-box">
      <input type="checkbox" bind:checked={deleteUnderstand} />
      {$LL.deleteChannelUnderstand()}
    </label>

    <button
      class="delete-btn"
      disabled={!deleteUnderstand}
      on:click={() => {
        if (confirm($LL.deleteChannelConfirmation())) {
          deleteChannel();
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

<Loading show={loading} />

<style lang="scss">
  .container {
    padding: 8px;
    max-width: 600px;
    margin: 0 auto;

    .header {
      display: flex;
    }

    .name-box {
      display: flex;
      align-items: center;
      margin: 0 0 16px 0;
      .name {
        font-size: 22px;
      }
      .icon {
        width: 64px;
        height: 64px;
        margin: 0 0 0 auto;
      }
    }

    .actions-instruction {
      margin: 16px;
    }
    .actions {
      list-style: inside;
      li {
        margin: 8px 24px;
      }
      hr {
        margin: 12px 0;
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
