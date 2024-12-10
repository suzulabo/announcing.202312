<script lang="ts" module>
  import Logo from '@announcing/components/Logo.svelte';
  import type { Locales } from '@announcing/i18n';
  import Cookies from 'js-cookie';

  const updateLocale = (locale: Locales) => {
    if (browser) {
      Cookies.set('locale', locale);
      return setupLocale(locale);
    }
    return;
  };

  const updateTheme = (theme: string) => {
    if (!browser) {
      return;
    }

    Cookies.set('theme', theme);
    document.documentElement.setAttribute('data-color-scheme', theme);
  };

  const getSystemTheme = () => {
    if (browser && 'matchMedia' in window) {
      const m = window.matchMedia('(prefers-color-scheme: dark)');
      if (m.matches) {
        return 'dark';
      }
    }

    return 'light';
  };

  type BackLabelKeys = 'back';

  export type HeaderBack = {
    href: string;
    labelKey: BackLabelKeys;
  };

  export type HeaderNotification = {
    channelID: string;
    name: string;
    icon?: string;
  };
</script>

<script lang="ts">
  import { LL, setupLocale } from '@announcing/i18n';

  import { browser } from '$app/environment';
  import { page } from '$app/stores';

  import MaterialSymbolsNotificationImportantOutlineRounded from '$lib/components/icon/MaterialSymbolsNotificationImportantOutlineRounded.svelte';
  import MaterialSymbolsNotificationsOutlineRounded from '$lib/components/icon/MaterialSymbolsNotificationsOutlineRounded.svelte';
  import MaterialSymbolsSettingsOutline from '$lib/components/icon/MaterialSymbolsSettingsOutline.svelte';
  import { initFirebase, isNotificationSupported } from '$lib/firebase/firebase';
  import { setupBack } from '@announcing/components/actions/back';
  import { onMount, type Snippet } from 'svelte';
  import type { LayoutData } from './$types';
  import SettingsModal from './SettingsModal.svelte';
  import NotificationModal from './NotificationModal.svelte';

  interface Props {
    data: LayoutData;
    children?: Snippet;
  }

  let { data, children }: Props = $props();

  let theme = $state(Cookies.get('theme') ?? getSystemTheme());
  let locale = $state(data.locale);
  let supported = $state(false);
  let headerBack = $derived<HeaderBack | undefined>($page.data['headerBack']);
  let headerNotification = $derived<HeaderNotification | undefined>(
    $page.data['headerNotification'],
  );

  let notificationModal: ReturnType<typeof NotificationModal>;
  let settingsModal: ReturnType<typeof SettingsModal>;

  $effect(() => {
    void updateLocale(locale);
  });
  $effect(() => {
    updateTheme(theme);
  });

  onMount(async () => {
    await initFirebase();
    supported = isNotificationSupported();

    document.documentElement.setAttribute('hydrated', '');
  });

  const back = setupBack();
</script>

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
          notificationModal.openModal();
        }}
      >
        {#if supported}
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
<SettingsModal bind:this={settingsModal} bind:locale bind:theme />

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
