<script lang="ts">
  import SettingsModal from '$lib/parts/SettingsModal/SettingsModal.svelte';
  import type { Locales } from '@announcing/i18n';
  import { LL, setupLocale } from '@announcing/i18n';
  import Cookies from 'js-cookie';
  import { onMount } from 'svelte';
  import type { LayoutData } from './$types';

  interface Props {
    data: LayoutData;
    children?: import('svelte').Snippet;
  }

  let { data, children }: Props = $props();

  let locale = $state(data.locale);
  let settingsModal = $state<SettingsModal>();

  const onLocaleChange = (locale: Locales) => {
    Cookies.set('locale', locale);
    return setupLocale(locale);
  };

  onMount(async () => {
    await onLocaleChange(locale);
  });
</script>

<div class="tool-bar">
  <a href="/">Announcing Components</a>
  <button
    class="settings-btn"
    onclick={() => {
      settingsModal?.openModal(locale);
    }}>{$LL.settings()}</button
  >
</div>

{@render children?.()}

<SettingsModal bind:this={settingsModal} requestTheme={data.requestTheme} {onLocaleChange} />

<style lang="scss">
  .tool-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 8px;

    .settings-btn {
      margin-left: auto;
    }
  }
</style>
