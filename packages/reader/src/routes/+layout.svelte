<script lang="ts" module>
  import type { Locales } from '@announcing/i18n';
  import Cookies from 'js-cookie';
  import Logo from '@announcing/components/Logo.svelte';

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
  import { initFirebase } from '$lib/firebase/firebase';
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

  let settingsModal: ReturnType<typeof SettingsModal>;

  $effect(() => {
    void updateLocale(locale);
  });
  $effect(() => {
    updateTheme(theme);
  });

  onMount(async () => {
    document.documentElement.setAttribute('hydrated', '');

    await initFirebase();
  });

  const back = setupBack();
</script>

<div class="container">
  <header>
    {#if headerBack}
      <a href={headerBack.href} use:back>{$LL[headerBack.labelKey]()}</a>
    {:else}
      <a href="/" class="site-name"><Logo /></a>
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

<SettingsModal bind:this={settingsModal} bind:locale bind:theme />

<style lang="scss">
  .container {
    max-width: 600px;
    margin: 0 auto 100px;

    header {
      padding: 0 8px;
      display: flex;
      align-items: center;
      height: 60px;

      .site-name {
        font-size: 28px;
        border-radius: 50%;
        //border: 1px solid var(--color-border);
        background-color: var(--color-background-light);
        height: 36px;
        width: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .settings-btn {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 2px;
      }
    }
  }
</style>
