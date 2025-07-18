<script lang="ts">
  import '../app.scss';

  import { afterNavigate } from '$app/navigation';
  import { navigating, page } from '$app/state';
  import F7SquareFavorites from '$lib/components/icon/F7SquareFavorites.svelte';
  import MaterialSymbolsSettingsOutline from '$lib/components/icon/MaterialSymbolsSettingsOutline.svelte';
  import MdiReload from '$lib/components/icon/MdiReload.svelte';
  import { isPWA } from '$lib/platform/platform';
  import { setupBack } from '@announcing/components/actions/back';
  import Navigating from '@announcing/components/Navigating.svelte';
  import SettingsModal from '@announcing/components/SettingsModal.svelte';
  import { LL } from '@announcing/i18n';
  import { onMount, tick, type Snippet } from 'svelte';
  import { fade } from 'svelte/transition';
  import type { LayoutData } from './$types';

  interface Props {
    data: LayoutData;
    children?: Snippet;
  }

  let { data, children }: Props = $props();

  let toolbarSize = $state('');

  let toolbarHidden = $state(false);
  let previousScrollY = $state(-1);
  let pwa = $state(false);

  let settingsModal: SettingsModal;

  onMount(() => {
    document.documentElement.setAttribute('hydrated', '');
    pwa = isPWA();
  });

  afterNavigate(() => {
    tick()
      .then(() => {
        /**
         VirtualScrollList used in ChanelView restores scrollY, so reset it.
        */
        previousScrollY = -1;
        toolbarHidden = false;
      })
      .catch(() => {
        //
      });
  });

  setupBack();

  const onScrollHandler = () => {
    if (previousScrollY < 0) {
      previousScrollY = window.screenY;
      return;
    }

    const currentY = window.scrollY;

    /**
     Hide the toolbar when scrolling down, and restore it when scrolling up.
     Make it slightly insensitive when hiding.
    */
    if (currentY > previousScrollY && currentY - previousScrollY > 10) {
      toolbarHidden = true;
    } else if (currentY < previousScrollY && previousScrollY - currentY) {
      toolbarHidden = false;
    }

    previousScrollY = currentY;
  };
</script>

<svelte:window onscroll={onScrollHandler} />

{#key page.url.pathname}
  <main in:fade>
    {@render children?.()}
  </main>
{/key}

<div class="toolbar" class:hidden={toolbarHidden} class:small={toolbarSize === 'compact'}>
  {#if !pwa}
    <a href="/favorites"><F7SquareFavorites /><span>{$LL.favorites()}</span></a>
  {/if}
  <button
    class="unstyled"
    onclick={() => {
      location.reload();
    }}><MdiReload /><span>{$LL.reload()}</span></button
  >
  <button
    class="unstyled"
    onclick={() => {
      settingsModal.openModal();
    }}><MaterialSymbolsSettingsOutline /><span>{$LL.settings()}</span></button
  >
</div>

<SettingsModal
  bind:this={settingsModal}
  requestLocale={data.requestLocale}
  requestTheme={data.requestTheme}
  bind:toolbarSize
/>

<Navigating show={!!navigating.from} />

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
  }

  .toolbar {
    margin-top: auto;
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;

    background-color: var(--color-background);
    border-top: 1px solid var(--color-border);
    transition: transform 0.2s ease;

    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));

    &.hidden {
      transform: translateY(100%);
    }

    a,
    button {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 0;
      margin: 0 auto;
      font-size: 24px;

      span {
        font-size: 13px;
      }
    }

    &.small {
      a,
      button {
        font-size: 28px;
        span {
          display: none;
        }
      }
    }

    @media (min-width: 800px) {
      position: fixed;
      top: 0;
      left: calc((100dvw - 600px) / 2 - 80px);
      right: unset;
      bottom: 0;
      width: 70px;
      margin: 64px 0 0;
      border-top: unset;
      display: flex;
      flex-direction: column;
      gap: 32px;
      &.hidden {
        transform: unset;
      }
    }
  }
</style>
