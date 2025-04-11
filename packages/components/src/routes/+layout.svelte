<script lang="ts">
  import SettingsModal from '$lib/parts/SettingsModal/SettingsModal.svelte';
  import { LL } from '@announcing/i18n';
  import type { LayoutData } from './$types';

  interface Props {
    data: LayoutData;
    children?: import('svelte').Snippet;
  }

  let { data, children }: Props = $props();

  let settingsModal = $state<SettingsModal>();
</script>

<div class="tool-bar">
  <a href="/">Announcing Components</a>
  <button
    class="settings-btn"
    onclick={() => {
      settingsModal?.openModal();
    }}>{$LL.settings()}</button
  >
</div>

{@render children?.()}

<SettingsModal
  bind:this={settingsModal}
  requestLocale={data.requestLocale}
  requestTheme={data.requestTheme}
/>

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
