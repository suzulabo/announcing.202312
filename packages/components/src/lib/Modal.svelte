<script lang="ts" context="module">
  const isIframe = window.self !== window.top;

  if (!isIframe && typeof window === 'object') {
    const popstateListener = () => {
      // Block going to URL with #modal on forward
      if (location.hash === '#modal' && !document.querySelector('.modal')) {
        history.back();
      }
    };

    window.addEventListener('popstate', popstateListener);
  }
</script>

<script lang="ts">
  import ModalSub from './ModalSub.svelte';

  export let show = false;
  export let closeAnywhere = false;
  export let padding = '0';

  $: {
    if (!isIframe) {
      if (show && location.hash !== '#modal') {
        history.pushState(undefined, '', '#modal');
      }
      if (!show && location.hash === '#modal') {
        history.back();
      }
    }
  }
</script>

<!--
To monitor keydown and popstate events only while the modal is displayed,
a sub component is used because svelte:window can only be added at the root level.
-->
{#if show}
  <ModalSub
    {closeAnywhere}
    {padding}
    on:close={() => {
      show = false;
    }}><slot /></ModalSub
  >
{/if}
