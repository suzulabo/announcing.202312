<script lang="ts">
  import '../app.scss';

  import { navigating, page } from '$app/state';
  import MaterialSymbolsSettingsOutline from '$lib/components/icon/MaterialSymbolsSettingsOutline.svelte';
  import { setupBack } from '@announcing/components/actions/back';
  import Navigating from '@announcing/components/Navigating.svelte';
  import Toolbar from '@announcing/components/Toolbar.svelte';
  import { MaterialSymbolsHomeOutlineRounded } from '@announcing/components/icons';
  import SettingsModal from '@announcing/components/SettingsModal.svelte';
  import { LL } from '@announcing/i18n';
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

  setupBack();
</script>

<svelte:head>
  <title>Announcing</title>
</svelte:head>

<header>
  <svelte:element
    this={siteNameElementAttrs.this}
    class="site-name-box unstyled"
    {...siteNameElementAttrs}
  >
    <span class="site-name">Announcing</span>
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

<Toolbar
  requestLocale={data.requestLocale}
  requestTheme={data.requestTheme}
  items={[
    { type: 'link', label: 'home', icon: MaterialSymbolsHomeOutlineRounded, href: '/' },
    { type: 'settings' },
  ]}
/>

<Navigating show={!!navigating.from} />

<SettingsModal
  bind:this={settingsModal}
  requestLocale={data.requestLocale}
  requestTheme={data.requestTheme}
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
