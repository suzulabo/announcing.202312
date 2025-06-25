<script lang="ts">
  import '../app.scss';

  import { navigating, page } from '$app/state';
  import MaterialSymbolsNotificationImportantOutlineRounded from '$lib/components/icon/MaterialSymbolsNotificationImportantOutlineRounded.svelte';
  import MaterialSymbolsNotificationsOutlineRounded from '$lib/components/icon/MaterialSymbolsNotificationsOutlineRounded.svelte';
  import MaterialSymbolsNotificationsRounded from '$lib/components/icon/MaterialSymbolsNotificationsRounded.svelte';
  import MaterialSymbolsSettingsOutline from '$lib/components/icon/MaterialSymbolsSettingsOutline.svelte';
  import {
    getNotificationChannels,
    type NotificationLocalStorageValue,
  } from '$lib/notification/localStorage';
  import { setupBack } from '@announcing/components/actions/back';
  import SettingsModal from '@announcing/components/SettingsModal.svelte';
  import Navigating from '@announcing/components/Navigating.svelte';
  import { LL } from '@announcing/i18n';
  import { onMount, type Snippet } from 'svelte';
  import type { LayoutData } from './$types';
  import MdiReload from '$lib/components/icon/MdiReload.svelte';

  interface Props {
    data: LayoutData;
    children?: Snippet;
  }

  let { data, children }: Props = $props();

  let headerNotification = $derived(page.data.headerNotification);
  let notificationHref = $derived(
    headerNotification?.channelID
      ? `/notification/${headerNotification.channelID}`
      : '/notification',
  );
  let notificationPermission = $state<NotificationPermission>('default');
  let notificationChannels = $state<NotificationLocalStorageValue>({});

  let settingsModal: SettingsModal;

  onMount(() => {
    document.documentElement.setAttribute('hydrated', '');
    if ('Notification' in window) {
      notificationPermission = Notification.permission;
      notificationChannels = getNotificationChannels();
    }
  });

  setupBack();
</script>

<header>
  <button
    class="unstyled reload"
    onclick={() => {
      location.reload();
    }}><MdiReload /></button
  >

  <a class="button small notification-btn" href={notificationHref}>
    {#if headerNotification}
      {#if notificationPermission === 'granted'}
        {#if headerNotification.channelID in notificationChannels}
          <MaterialSymbolsNotificationsRounded />
        {:else}
          <MaterialSymbolsNotificationsOutlineRounded />
        {/if}
      {:else if notificationPermission === 'default'}
        <MaterialSymbolsNotificationsOutlineRounded />
      {:else}
        <MaterialSymbolsNotificationImportantOutlineRounded />
      {/if}
    {/if}
    <span>{$LL.notification()}</span></a
  >

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

<footer>
  <div>
    <span class="copyright">&copy;Announcing</span>
  </div>
</footer>

<SettingsModal
  bind:this={settingsModal}
  requestLocale={data.requestLocale}
  requestTheme={data.requestTheme}
/>

<Navigating show={!!navigating.from} />

<style lang="scss">
  header {
    padding: 16px 8px 24px;
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 8px;

    .reload {
      display: none;
    }

    @media (display-mode: standalone) {
      .reload {
        display: flex;
        margin: 0 auto 0 4px;
        font-size: 18px;
        color: var(--color-text-subtle);
      }
    }

    .settings-btn,
    .notification-btn {
      display: flex;
      align-items: center;
      gap: 2px;
    }
  }

  footer {
    margin-top: auto;

    div {
      margin: 16px 0 0;
      padding: 16px;
      display: flex;

      .copyright {
        margin: auto;
      }
    }
  }
</style>
