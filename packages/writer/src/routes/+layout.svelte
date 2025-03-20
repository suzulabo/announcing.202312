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
  import { page } from '$app/state';

  import MaterialSymbolsSettingsOutline from '$lib/components/icon/MaterialSymbolsSettingsOutline.svelte';
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
  let headerBack = $derived<HeaderBack | undefined>(page.data['headerBack']);
  let siteNameElementAttrs = $derived(
    data.userID && page.url.pathname !== '/' ? { this: 'a', href: '/' } : { this: 'div' },
  );

  let settingsModal: ReturnType<typeof SettingsModal>;

  $effect(() => {
    void updateLocale(locale);
  });
  $effect(() => {
    updateTheme(theme);
  });

  onMount(() => {
    document.documentElement.setAttribute('hydrated', '');
  });

  const back = setupBack();
</script>

<div class="container">
  <header>
    {#if headerBack}
      <a href={headerBack.href} use:back>{$LL[headerBack.labelKey]()}</a>
    {:else}
      <svelte:element
        this={siteNameElementAttrs.this}
        class="site-name-box unstyled"
        {...siteNameElementAttrs}
      >
        <span class="site-name">Announcing</span>
        <span class="sub-title">{$LL.writer.subTitle()}</span>
      </svelte:element>
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

<SettingsModal bind:this={settingsModal} bind:locale bind:theme showSignOut={!!data.userID} />

<style lang="scss">
  .container {
    max-width: 600px;
    margin: 0 auto 100px;

    header {
      padding: 16px 8px;
      display: flex;
      align-items: center;

      .site-name-box {
        .site-name {
          font-size: 20px;
        }
        .sub-title {
          background-color: var(--color-background-highlight);
          padding: 4px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
        }
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
