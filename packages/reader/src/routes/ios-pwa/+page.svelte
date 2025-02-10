<script lang="ts">
  import { goto } from '$app/navigation';
  import { getPushToken } from '$lib/firebase/firebase';
  import { requestPermission } from '$lib/notification/notification';
  import { notificationState } from '$lib/notification/notificationState.svelte';
  import Loading from '@announcing/components/Loading.svelte';
  import { LL } from '@announcing/i18n';
  import Cookies from 'js-cookie';
  import { onMount } from 'svelte';

  let loading = $state(false);

  let permission = $derived(notificationState.permission);

  let content = $derived.by(() => {
    switch (permission) {
      case 'not-supported':
        return notSupportedContent;
      default:
        return defaultContent;
    }
  });

  const requestPermissionClick = async () => {
    loading = true;
    try {
      await requestPermission();
      if (permission === 'granted') {
        const token = await getPushToken();
        if (token) {
          Cookies.set('ios-token', token);
          await goto(`/ios-token`);
        }
      }
    } finally {
      loading = false;
    }
  };

  onMount(() => {
    console.log('page onMount');
  });
</script>

{#snippet notSupportedContent()}
  <div class="desc">{$LL.setupNotification.notSupported()}</div>
{/snippet}

{#snippet defaultContent()}
  <div class="desc">{$LL.setupNotification.description()}</div>
  <button onclick={requestPermissionClick}>{$LL.setupNotification.button()}</button>

  {#if permission === 'denied'}
    <div class="desc">{$LL.setupNotification.denied()}</div>
  {/if}
{/snippet}

{@render content()}

<Loading show={loading} />
