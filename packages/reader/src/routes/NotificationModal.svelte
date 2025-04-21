<script lang="ts">
  import { addChannel, removeChannel, requestPermission } from '$lib/notification/notification';
  import { notificationState } from '$lib/notification/notificationState.svelte';
  import Loading from '@announcing/components/Loading.svelte';
  import Modal from '@announcing/components/Modal.svelte';
  import { LL } from '@announcing/i18n';

  type HeaderNotification = App.PageData['headerNotification'];

  let permission = $derived(notificationState.permission);

  let channel = $state<HeaderNotification>();
  let open = $state(false);
  let loading = $state(false);

  let content = $derived.by(() => {
    switch (permission) {
      case 'not-supported':
        return notSupportedContent;
      case 'default':
        return defaultContent;
      case 'denied':
        return deniedContent;
      case 'granted':
        return grantedContent;
    }
  });

  const requestPermissionClick = async () => {
    loading = true;
    try {
      await requestPermission();
    } finally {
      loading = false;
    }
  };

  const enableClick = async () => {
    if (!channel) {
      return;
    }

    loading = true;
    try {
      await addChannel(channel.channelID);
    } finally {
      loading = false;
    }
  };

  const disableClick = async () => {
    if (!channel) {
      return;
    }

    loading = true;
    try {
      await removeChannel(channel.channelID);
    } finally {
      loading = false;
    }
  };

  export const openModal = (c: HeaderNotification) => {
    channel = c;
    open = true;
  };
</script>

<Modal bind:open dismissMode="backdrop">
  <div class="modal-body">
    {@render content()}
    <button
      class="close-btn small filled"
      onclick={() => {
        open = false;
      }}>{$LL.close()}</button
    >
  </div>
</Modal>

{#snippet notSupportedContent()}
  <div class="desc">{$LL.setupNotification.notSupported()}</div>
{/snippet}

{#snippet defaultContent()}
  <div class="desc">{$LL.setupNotification.description()}</div>
  <button onclick={requestPermissionClick}>{$LL.setupNotification.button()}</button>
{/snippet}

{#snippet deniedContent()}
  <div class="desc">{$LL.setupNotification.denied()}</div>
{/snippet}

{#snippet grantedContent()}
  {#if channel}
    {#if notificationState.channels.includes(channel.channelID)}
      <div class="desc">
        {@html $LL.setupNotification.grantedEnabled({ name: channel.name })}
      </div>
      <button onclick={disableClick}>{$LL.setupNotification.toDisabled()}</button>
    {:else}
      <div class="desc">
        {@html $LL.setupNotification.grantedDisabled({ name: channel.name })}
      </div>
      <button onclick={enableClick}>{$LL.setupNotification.toEnabled()}</button>
    {/if}
  {/if}
{/snippet}

<Loading show={loading} />

<style lang="scss">
  .modal-body {
    background-color: var(--color-background);
    border-radius: 8px;
    margin: auto;
    padding: 16px;
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    .desc {
      white-space: pre-wrap;
    }

    .close-btn {
      margin-top: 8px;
    }
  }
</style>
