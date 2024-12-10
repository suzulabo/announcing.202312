<script lang="ts">
  import { isNotificationSupported } from '$lib/firebase/firebase';
  import Modal from '@announcing/components/Modal.svelte';
  import { LL } from '@announcing/i18n';

  let permission = $state<NotificationPermission | 'not-supported'>('not-supported');

  let open = $state(false);

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

  const checkPermission = () => {
    if (!isNotificationSupported()) {
      return 'not-supported';
    }

    return Notification.permission;
  };

  const requestPermissionClick = async () => {
    permission = await Notification.requestPermission();
  };

  export const openModal = () => {
    permission = checkPermission();
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
  Granted
{/snippet}

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

    .desc {
      white-space: pre-wrap;
      margin: 16px 0;
    }
  }
</style>
