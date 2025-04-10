<script lang="ts">
  import { page } from '$app/state';
  import { getPushToken } from '$lib/firebase/firebase';
  import { requestPermission } from '$lib/notification/notification';
  import { notificationState } from '$lib/notification/notificationState.svelte';
  import { setIOSBrowserSchema } from '$lib/platform/localStorage';
  import { resolveBrowserSchema } from '$lib/platform/resolveBrowserSchema';
  import Loading from '@announcing/components/Loading.svelte';
  import { LL } from '@announcing/i18n';

  let browserSchema = $state('x-safari-https://@urlBase');
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
      if (token) {
        setIOSBrowserSchema(browserSchema);
        const urlResolved = resolveBrowserSchema(`${page.url.origin}/ios-token?token=${token}`);
        location.href = urlResolved;
      }
    }
  };

  const browserSchemas = [
    ['Safari', 'x-safari-https://@urlBase'],
    ['Chrome', 'googlechromes://@urlBase'],
    ['Firefox', 'firefox://open-url?url=@urlEncoded'],
    ['Opera', 'touch-https://@urlBase'],
    ['Edge', 'microsoft-edge-https://@urlBase'],
  ] as const;
</script>

{#snippet notSupportedContent()}
  <div class="desc">{$LL.setupNotification.notSupported()}</div>
{/snippet}

{#snippet defaultContent()}
  <div class="desc">{$LL.setupNotification.description()}</div>

  <div class="browser-schemas">
    {#each browserSchemas as [name, schema] (name)}
      <label>
        <input type="radio" name="browser-schema" value={schema} bind:group={browserSchema} />{name}
      </label>
    {/each}
  </div>

  <button onclick={requestPermissionClick}>{$LL.setupNotification.button()}</button>

  {#if permission === 'denied'}
    <div class="desc">{$LL.setupNotification.denied()}</div>
  {/if}
{/snippet}

{@render content()}

<Loading show={loading} />

<style lang="scss">
  .browser-schemas {
    display: grid;
    grid-template-columns: repeat(auto-fit, 100px);
  }
</style>
