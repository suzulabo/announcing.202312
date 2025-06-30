<script lang="ts">
  import '../app.scss';

  import { afterNavigate } from '$app/navigation';
  import { navigating, page } from '$app/state';
  import { setupBack } from '@announcing/components/actions/back';
  import Navigating from '@announcing/components/Navigating.svelte';
  import SettingsModal from '@announcing/components/SettingsModal.svelte';
  import { onMount, tick, type Snippet } from 'svelte';
  import { fade } from 'svelte/transition';
  import type { LayoutData } from './$types';

  interface Props {
    data: LayoutData;
    children?: Snippet;
  }

  let { data, children }: Props = $props();

  let menubarHidden = $state(false);
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
        menubarHidden = false;
      })
      .catch(() => {
        //
      });
  });

  setupBack();
</script>

<svelte:window
  onscroll={() => {
    if (previousScrollY < 0) {
      previousScrollY = window.screenY;
      return;
    }

    const currentY = window.scrollY;

    /**
     Hide the menubar when scrolling down, and restore it when scrolling up.
     Make it slightly insensitive when hiding.
    */
    if (currentY > previousScrollY && currentY - previousScrollY > 10) {
      menubarHidden = true;
    } else if (currentY < previousScrollY && previousScrollY - currentY) {
      menubarHidden = false;
    }

    previousScrollY = currentY;
  }}
/>

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

<div class="menu-bar" class:hidden={menubarHidden}>
  <button class="unstyled">履歴</button>
  <button
    class="unstyled"
    onclick={() => {
      settingsModal.openModal();
    }}>設定</button
  >
</div>

<SettingsModal
  bind:this={settingsModal}
  requestLocale={data.requestLocale}
  requestTheme={data.requestTheme}
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

  .menu-bar {
    margin-top: auto;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background-color: var(--color-background);
    border-top: 1px solid var(--color-border);
    transition: transform 0.3s ease;

    display: flex;

    &.hidden {
      transform: translateY(100%);
    }
  }
</style>
