<script lang="ts" context="module">
  /*
  const isIframe = typeof window === 'object' && window.self !== window.top;

  if (!isIframe && typeof window === 'object') {
    const popstateListener = () => {
      // Block going to URL with #modal on forward
      if (location.hash === '#modal' && !document.querySelector('.modal')) {
        history.back();
      }
    };

    window.addEventListener('popstate', popstateListener);
  }
    */
</script>

<script lang="ts">
  import { pushState } from '$app/navigation';
  import { page } from '$app/stores';

  import ModalSub from './ModalSub.svelte';

  export let modalID: string;
  export let dismissMode: 'backdrop' | 'anywhere' | 'none' = 'backdrop';
  export let padding = '0';

  export const showModal = () => {
    const pageState = $page.state;
    if (!pageState.modal?.[modalID]) {
      const modal = pageState.modal ?? {};
      modal[modalID] = true;
      pushState('', { ...pageState, modal });
    }
  };

  export const closeModal = () => {
    const pageState = $page.state;
    if (pageState.modal?.[modalID]) {
      history.back();
    }
  };
</script>

<!--
To monitor keydown and popstate events only while the modal is displayed,
a sub component is used because svelte:window can only be added at the root level.
-->
{#if $page.state.modal?.[modalID]}
  <ModalSub
    {dismissMode}
    {padding}
    on:dismiss={() => {
      closeModal();
    }}><slot /></ModalSub
  >
{/if}
