<script lang="ts" context="module">
  import { browser } from '$app/environment';
  import type { Locales } from '@announcing/i18n';
  import { setupLocale } from '@announcing/i18n';
  import Cookies from 'js-cookie';

  const updateLocale = (locale: Locales) => {
    if (browser) {
      Cookies.set('locale', locale);
      return setupLocale(locale);
    }
    return;
  };

  const updateColorScheme = (colorScheme: string) => {
    if (browser) {
      if (colorScheme === 'light' || colorScheme === 'dark') {
        Cookies.set('color-scheme', colorScheme);
        document.documentElement.setAttribute('data-color-scheme', colorScheme);
        return;
      }
      Cookies.remove('color-scheme');
      document.documentElement.removeAttribute('data-color-scheme');
    }
  };
</script>

<script lang="ts">
  import type { LayoutServerData } from './$types';

  export let data: LayoutServerData;

  let colorScheme = Cookies.get('color-scheme') ?? '';

  $: locale = data.locale;
  $: void updateLocale(locale);
  $: updateColorScheme(colorScheme);
</script>

<div class="tool-bar">
  <select class="color-mode" bind:value={colorScheme}>
    <option value="">Default</option>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
  </select>
  <select class="lang" bind:value={data.locale}>
    <option value="en">English</option>
    <option value="ja">日本語</option>
  </select>
</div>

<slot />

<style lang="scss">
  .tool-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 8px;

    select {
      all: revert;
      height: 30px;
    }

    .color-mode {
      margin-left: auto;
    }
  }
</style>
