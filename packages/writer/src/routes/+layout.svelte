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
  import { signOut } from '@auth/sveltekit/client';

  import { browser } from '$app/environment';
  import { page } from '$app/stores';

  import type { LayoutServerData } from './$types';
  import MaterialSymbolsLanguage from '$lib/components/icon/MaterialSymbolsLanguage.svelte';
  import MaterialSymbolsLogout from '$lib/components/icon/MaterialSymbolsLogout.svelte';

  export let data: LayoutServerData;

  let languagesSelect: HTMLSelectElement;

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

    <div class="menu-box">
      <MaterialSymbolsLanguage />
      <select bind:this={languagesSelect} bind:value={data.locale}>
        <option value="en">English</option>
        <option value="ja">日本語</option>
      </select>
      {#if data.userID}
        <button
          class="sign-out text"
          on:click={() => {
            void signOut();
          }}><MaterialSymbolsLogout />{$LL.signOut()}</button
        >
      {/if}
    </div>
  </header>
  <hr />
  <slot />
</div>

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
          background-color: var(--color-background-light);
          padding: 4px;
          border-radius: 4px;
          font-size: 14px;
        }
      }

      .menu-box {
        display: flex;
        align-items: center;
        margin-left: auto;
        font-size: 14px;

        select {
          margin-left: 2px;
        }

        .sign-out {
          margin-left: 8px;
          font-weight: normal;
          display: flex;
          align-items: center;
        }
      }
    }
  }
</style>
