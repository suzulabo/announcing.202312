<script lang="ts" module>
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
</script>

<script lang="ts">
  import { LL, setupLocale } from '@announcing/i18n';

  import { browser } from '$app/environment';
  import { page } from '$app/stores';

  import MaterialSymbolsSettingsOutline from '$lib/components/icon/MaterialSymbolsSettingsOutline.svelte';
  import { getPushToken, initFirebase } from '$lib/firebase/firebase';
  import { setupBack } from '@announcing/components/actions/back';
  import { onMount, type Snippet } from 'svelte';
  import type { LayoutData } from './$types';
  import SettingsModal from './SettingsModal.svelte';

  interface Props {
    data: LayoutData;
    children?: Snippet;
  }

  let { data, children }: Props = $props();

  let theme = $state(Cookies.get('theme') ?? getSystemTheme());
  let locale = $state(data.locale);
  let headerBack = $derived<HeaderBack | undefined>($page.data['headerBack']);
  let token = $state<string | undefined>();

  let settingsModal: ReturnType<typeof SettingsModal>;

  $effect(() => {
    void updateLocale(locale);
  });
  $effect(() => {
    updateTheme(theme);
  });

  onMount(() => {
    document.documentElement.setAttribute('hydrated', '');

    initFirebase();
  });

  const back = setupBack();

  const getTokenClick = async () => {
    try {
      token = await getPushToken();
    } catch (err) {
      token = JSON.stringify(err, undefined, 2);
    }
  };
</script>

<div class="container">
  <header>
    {#if headerBack}
      <a href={headerBack.href} use:back>{$LL[headerBack.labelKey]()}</a>
    {:else}
      <a href="/" class="site-name">♪</a>
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
    <button class="small" onclick={getTokenClick}> getToken </button>
  </header>
  <pre>{token}</pre>
  <hr />
  {@render children?.()}
</div>

<SettingsModal bind:this={settingsModal} bind:locale bind:theme />

<style lang="scss">
  pre {
    border: 1px solid black;
    white-space: pre-line;
    word-break: break-all;
    padding: 8px;
  }

  .container {
    max-width: 600px;
    margin: 0 auto 100px;

    header {
      padding: 16px 8px;
      display: flex;
      align-items: center;

      .settings-btn {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 2px;
      }
    }
  }
</style>
