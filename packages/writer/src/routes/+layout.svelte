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
  import NavigationSupport from '@announcing/components/NavigationSupport.svelte';
  import { LL, setupLocale } from '@announcing/i18n';

  import { browser } from '$app/environment';

  import type { LayoutServerData } from './$types';

  export let data: LayoutServerData;

  $: siteNameElementAttrs = data.userID ? { this: 'a', href: '/' } : { this: 'div' };
  $: locale = data.locale;
  $: void updateLocale(locale);
</script>

<div class="container">
  <header>
    <svelte:element
      this={siteNameElementAttrs.this}
      class="site-name-box"
      {...siteNameElementAttrs}
    >
      <span class="site-name">Announcing</span>
      <span class="sub-title">{$LL.writer.subTitle()}</span>
    </svelte:element>
    <select bind:value={data.locale}>
      <option value="en">English</option>
      <option value="ja">日本語</option>
    </select>
  </header>
  <hr />
  <slot />
</div>

<NavigationSupport />

<style lang="scss">
  .container {
    max-width: 800px;
    margin: 0 auto;

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

      select {
        margin-left: auto;
      }
    }
  }
</style>
