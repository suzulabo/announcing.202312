<script lang="ts">
  import Logo from '@announcing/components/Logo.svelte';
  import { LL } from '@announcing/i18n';
  import { page } from '$app/state';
  import MaterialSymbolsNotificationImportantOutlineRounded from '$lib/components/icon/MaterialSymbolsNotificationImportantOutlineRounded.svelte';
  import MaterialSymbolsNotificationsOutlineRounded from '$lib/components/icon/MaterialSymbolsNotificationsOutlineRounded.svelte';
  import MaterialSymbolsNotificationsRounded from '$lib/components/icon/MaterialSymbolsNotificationsRounded.svelte';
  import MaterialSymbolsSettingsOutline from '$lib/components/icon/MaterialSymbolsSettingsOutline.svelte';
  import { initFirebase } from '$lib/firebase/firebase';
  import { initNotification } from '$lib/notification/notification';
  import { notificationState } from '$lib/notification/notificationState.svelte';
  import { isIOS, isStandalone } from '$lib/platform/platform';
  import { setupBack } from '@announcing/components/actions/back';
  import SettingsModal from '@announcing/components/SettingsModal.svelte';
  import { onMount, type Snippet } from 'svelte';
  import type { LayoutData } from './$types';
  import NotificationModal from './NotificationModal.svelte';

  interface Props {
    data: LayoutData;
    children?: Snippet;
  }

  let { data, children }: Props = $props();

  let addManifest = $state(isIOS() && !isStandalone());
  let headerBack = $derived(page.data.headerBack);
  let headerNotification = $derived(page.data.headerNotification);

  let notificationModal: NotificationModal;
  let settingsModal: SettingsModal;

  onMount(async () => {
    await initFirebase();
    await initNotification();

    document.documentElement.setAttribute('hydrated', '');
  });

  const back = setupBack();
</script>

<svelte:head>
  {#if addManifest}
    <link rel="manifest" href="/ios.webmanifest}" />
  {/if}
</svelte:head>

<div class="container">
  <header>
    {#if headerBack}
      <a class="back" href={headerBack.href} use:back>{$LL[headerBack.labelKey]()}</a>
    {:else}
      <a href="/" class="site-name"><Logo /></a>
    {/if}

    {#if headerNotification}
      <button
        class="small notification-btn"
        onclick={() => {
          notificationModal.openModal(headerNotification);
        }}
      >
        {#if notificationState.permission === 'granted'}
          {#if headerNotification.channelID in notificationState.channels}
            <MaterialSymbolsNotificationsRounded />
          {:else}
            <MaterialSymbolsNotificationsOutlineRounded />
          {/if}
        {:else if notificationState.permission === 'default'}
          <MaterialSymbolsNotificationsOutlineRounded />
        {:else}
          <MaterialSymbolsNotificationImportantOutlineRounded />
        {/if}
        <span>{$LL.notification()}</span></button
      >
    {/if}

    <button
      class="small settings-btn"
      onclick={() => {
        settingsModal.openModal();
      }}
    >
      <MaterialSymbolsSettingsOutline />
      <span>{$LL.settings()}</span></button
    >
  </header>
  <hr />
  {@render children?.()}
</div>

<NotificationModal bind:this={notificationModal} />
<SettingsModal
  bind:this={settingsModal}
  requestLocale={data.requestLocale}
  requestTheme={data.requestTheme}
/>

<style lang="scss">
  .container {
    max-width: 600px;
    margin: 0 auto 100px;

    header {
      padding: 0 8px;
      display: flex;
      align-items: center;
      gap: 4px;
      height: 60px;

      .site-name,
      .back {
        margin-right: auto;
      }

      .site-name {
        font-size: 28px;
        border-radius: 50%;
        background-color: var(--color-background-light);
        height: 36px;
        width: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .settings-btn,
      .notification-btn {
        display: flex;
        align-items: center;
        gap: 2px;
      }
    }
  }
</style>
