<script lang="ts">
  import { page } from '$app/state';
  import { getPushToken } from '$lib/firebase/firebase';
  import { requestPermission } from '$lib/notification/notification';
  import { notificationState } from '$lib/notification/notificationState.svelte';
  import Loading from '@announcing/components/Loading.svelte';
  import { LL } from '@announcing/i18n';
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
    } finally {
      loading = false;
    }

    if (permission === 'granted') {
      const token = await getPushToken();
      const uuid = page.url.searchParams.get('uuid');
      if (token && uuid) {
        location.href = `x-safari-https://${page.url.host}/ios-token${location.search}&token=${token}`;
      }
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
