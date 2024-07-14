<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import ModalSub, { modalHashWatcher } from './ModalSub.svelte';

  export let show = false;
  export let closeAnywhere = false;

  const closeDispatch = createEventDispatcher();

  $modalHashWatcher;
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
