<script lang="ts" context="module">
  const popstateListener = () => {
    // Block going to URL with #modal on forward
    if (location.hash === '#modal' && !document.querySelector('.modal')) {
      history.back();
    }
  };

  window.addEventListener('popstate', popstateListener);
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import ModalSub from './ModalSub.svelte';

  export let show = false;
  export let closeAnywhere = false;

  const closeDispatch = createEventDispatcher();
</script>

<!--
To monitor keydown and popstate events only while the modal is displayed,
a sub component is used because svelte:window can only be added at the root level.
-->
{#if show}
  <ModalSub
    {closeAnywhere}
    on:close={() => {
      closeDispatch('close');
    }}><slot /></ModalSub
  >
{/if}
