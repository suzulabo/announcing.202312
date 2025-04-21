<script lang="ts">
  import '../app.scss';

  import { page } from '$app/state';
  import MaterialSymbolsSettingsOutline from '$lib/components/icon/MaterialSymbolsSettingsOutline.svelte';
  import { setupBack } from '@announcing/components/actions/back';
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

  let headerBack = $derived(page.data.headerBack);
  let siteNameElementAttrs = $derived(
    data.userID && page.url.pathname !== '/' ? { this: 'a', href: '/' } : { this: 'div' },
  );

  let settingsModal: SettingsModal;

  onMount(() => {
    document.documentElement.setAttribute('hydrated', '');
  });

  const back = setupBack();
</script>

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
    border-bottom: 1px solid var(--color-border);
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
      border-top: 1px solid var(--color-border);
      padding: 16px;
      display: flex;

      .copyright {
        margin: auto;
      }
    }
  }
</style>
