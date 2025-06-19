<script lang="ts">
  import '../app.scss';

  import { page } from '$app/state';
  import MaterialSymbolsSettingsOutline from '$lib/components/icon/MaterialSymbolsSettingsOutline.svelte';
  import SettingsModal from '@announcing/components/SettingsModal.svelte';
  import { LL } from '@announcing/i18n';
  import { signOut } from '@auth/sveltekit/client';
  import { onMount, type Snippet } from 'svelte';
  import type { LayoutData } from './$types';

  interface Props {
    data: LayoutData;
    children?: Snippet;
  }

  let { data, children }: Props = $props();

  let siteNameElementAttrs = $derived(
    data.userID && page.url.pathname !== '/' ? { this: 'a', href: '/' } : { this: 'div' },
  );

  let settingsModal: SettingsModal;

  onMount(() => {
    document.documentElement.setAttribute('hydrated', '');
  });
</script>

<svelte:head>
  <title>Announcing - {$LL.writer.subTitle()}</title>
</svelte:head>

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
    onclick={() => {
      settingsModal.openModal();
    }}
  >
    <MaterialSymbolsSettingsOutline />
    <span>{$LL.settings()}</span></button
  >
</header>

{@render children?.()}

<footer>
  <div>
    <span class="copyright">&copy;Announcing</span>
  </div>
</footer>

<SettingsModal
  bind:this={settingsModal}
  requestLocale={data.requestLocale}
  requestTheme={data.requestTheme}
  onSignOut={data.userID
    ? () => {
        void signOut();
      }
    : undefined}
/>

<style lang="scss">
  header {
    padding: 16px 8px;
    display: flex;
    align-items: center;
    margin-bottom: 16px;

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

  footer {
    margin-top: auto;

    div {
      margin: 16px 0 0;
      padding: 16px;
      display: flex;

      .copyright {
        margin: auto;
      }
    }
  }
</style>
