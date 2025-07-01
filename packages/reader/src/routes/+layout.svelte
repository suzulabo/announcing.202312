<script lang="ts">
  import '../app.scss';

  import { afterNavigate } from '$app/navigation';
  import { navigating, page } from '$app/state';
  import F7SquareFavorites from '$lib/components/icon/F7SquareFavorites.svelte';
  import MaterialSymbolsSettingsOutline from '$lib/components/icon/MaterialSymbolsSettingsOutline.svelte';
  import MdiReload from '$lib/components/icon/MdiReload.svelte';
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

  let settingsModal: SettingsModal;

  onMount(() => {
    document.documentElement.setAttribute('hydrated', '');
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

<footer>
  <div>
    <span class="copyright">&copy;Announcing</span>
  </div>
</footer>

<div class="toolbar" class:hidden={toolbarHidden} class:small={toolbarSize === 'compact'}>
  <button class="unstyled"><F7SquareFavorites /><span>{$LL.favorites()}</span></button>
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

  .toolbar {
    margin-top: auto;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;

    background-color: var(--color-background);
    border-top: 1px solid var(--color-border);
    transition: transform 0.2s ease;

    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    &.hidden {
      transform: translateY(100%);
    }

    button {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 0;
      font-size: 24px;

      span {
        font-size: 13px;
      }
    }

    &.small {
      button {
        font-size: 28px;
        span {
          display: none;
        }
      }
    }
  }
</style>
