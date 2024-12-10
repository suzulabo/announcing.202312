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
  </div></Modal
>

{#snippet notSupportedContent()}
  Not Supported
{/snippet}

{#snippet defaultContent()}
  <pre>{$LL.setupNotification.description()}</pre>
  <button onclick={requestPermissionClick}>{$LL.setupNotification.button()}</button>
{/snippet}

{#snippet deniedContent()}
  Denied
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

    pre {
      white-space: pre-wrap;
    }
  }
</style>
