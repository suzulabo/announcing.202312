<script lang="ts">
  import '../app.scss';

  import { browser } from '$app/environment';
  import { afterNavigate } from '$app/navigation';
  import { navigating, page } from '$app/state';
  import MaterialSymbolsNotificationImportantOutlineRounded from '$lib/components/icon/MaterialSymbolsNotificationImportantOutlineRounded.svelte';
  import MaterialSymbolsNotificationsOutlineRounded from '$lib/components/icon/MaterialSymbolsNotificationsOutlineRounded.svelte';
  import MaterialSymbolsNotificationsRounded from '$lib/components/icon/MaterialSymbolsNotificationsRounded.svelte';
  import MaterialSymbolsSettingsOutline from '$lib/components/icon/MaterialSymbolsSettingsOutline.svelte';
  import MdiReload from '$lib/components/icon/MdiReload.svelte';
  import { getNotificationChannels } from '$lib/notification/localStorage';
  import { setupBack } from '@announcing/components/actions/back';
  import Navigating from '@announcing/components/Navigating.svelte';
  import SettingsModal from '@announcing/components/SettingsModal.svelte';
  import { LL } from '@announcing/i18n';
  import { onMount, tick, type Snippet } from 'svelte';
  import { fade } from 'svelte/transition';
  import type { LayoutData } from './$types';

  interface Props {
    data: LayoutData;
    children?: Snippet;
  }

  let { data, children }: Props = $props();

  let headerNotification = $derived(page.data.headerNotification);
  let notificationStatus = $derived.by(() => {
    if (!headerNotification || !browser) {
      return;
    }

    const enabled = headerNotification.channelID in getNotificationChannels();

    if (enabled) {
      if (Notification.permission !== 'granted') {
        return 'alert';
      }
      return 'enabled';
    }

    return 'disabled';
  });

  let menubarHidden = $state(false);
  let previousScrollY = $state(-1);

  let settingsModal: SettingsModal;

  onMount(() => {
    document.documentElement.setAttribute('hydrated', '');
  });

  afterNavigate(() => {
    tick()
      .then(() => {
        /**
         VirtualScrollList used in ChanelView restores scrollY, so reset it.
        */
        previousScrollY = -1;
        menubarHidden = false;
      })
      .catch(() => {
        //
      });
  });

  setupBack();
</script>

<svelte:window
  onscroll={() => {
    if (previousScrollY < 0) {
      previousScrollY = window.screenY;
      return;
    }

    const currentY = window.scrollY;

    /**
     Hide the menubar when scrolling down, and restore it when scrolling up.
     Make it slightly insensitive when hiding.
    */
    if (currentY > previousScrollY && currentY - previousScrollY > 10) {
      menubarHidden = true;
    } else if (currentY < previousScrollY && previousScrollY - currentY) {
      menubarHidden = false;
    }

    previousScrollY = currentY;
  }}
/>

<header>
  <button
    class="unstyled reload"
    onclick={() => {
      location.reload();
    }}><MdiReload /></button
  >

  {#if headerNotification}
    <a class="button small notification-btn" href={`/notification/${headerNotification.channelID}`}>
      {#if notificationStatus === 'enabled'}
        <MaterialSymbolsNotificationsRounded />
      {:else if notificationStatus === 'disabled'}
        <MaterialSymbolsNotificationsOutlineRounded />
      {:else if notificationStatus === 'alert'}
        <MaterialSymbolsNotificationImportantOutlineRounded />
      {/if}

      <span>{$LL.notification()}</span></a
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

{#key page.url.pathname}
  <main in:fade>
    {@render children?.()}
  </main>
{/key}

<footer>
  <div>
    <span class="copyright">&copy;Announcing</span>
  </div>
</footer>

<div class="menu-bar" class:hidden={menubarHidden}>
  <button class="unstyled">履歴</button>
  <button class="unstyled">設定</button>
</div>

<SettingsModal
  bind:this={settingsModal}
  requestLocale={data.requestLocale}
  requestTheme={data.requestTheme}
/>

<Navigating show={!!navigating.from} />

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
  }

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

  .menu-bar {
    margin-top: auto;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background-color: var(--color-background);
    border-top: 1px solid var(--color-border);
    transition: transform 0.3s ease;

    display: flex;

    &.hidden {
      transform: translateY(100%);
    }
  }
</style>
