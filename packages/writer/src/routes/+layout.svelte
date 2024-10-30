<script lang="ts" context="module">
  import type { Locales } from '@announcing/i18n';
  import Cookies from 'js-cookie';

  const updateLocale = (locale: Locales) => {
    if (browser) {
      Cookies.set('locale', locale);
      return setupLocale(locale);
    }
    return;
  };
</script>

<script lang="ts">
  import { LL, setupLocale } from '@announcing/i18n';

  import { browser } from '$app/environment';
  import { page } from '$app/stores';

  import MaterialSymbolsSettingsOutline from '$lib/components/icon/MaterialSymbolsSettingsOutline.svelte';
  import type { LayoutServerData } from './$types';
  import SettingsModal from './SettingsModal.svelte';

  export let data: LayoutServerData;

  let settingsModal: SettingsModal;

  $: siteNameElementAttrs =
    data.userID && $page.url.pathname !== '/' ? { this: 'a', href: '/' } : { this: 'div' };
  $: locale = data.locale;
  $: void updateLocale(locale);
</script>

<div class="container">
  <header>
    <svelte:element
      this={siteNameElementAttrs.this}
      class="site-name-box unstyled"
      {...siteNameElementAttrs}
    >
      <span class="site-name">Announcing</span>
      <span class="sub-title">{$LL.writer.subTitle()}</span>
    </svelte:element>

    <button
      class="small settings-btn"
      on:click={() => {
        settingsModal.openModal();
      }}
    >
      <MaterialSymbolsSettingsOutline />
      <span>{$LL.settings()}</span></button
    >
  </header>
  <hr />
  <slot />
</div>

<SettingsModal bind:this={settingsModal} bind:locale={data.locale} showSignOut={!!data.userID} />

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
