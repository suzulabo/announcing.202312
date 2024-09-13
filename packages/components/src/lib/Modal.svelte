<script lang="ts">
  import { pushState } from '$app/navigation';
  import { page } from '$app/stores';

  import ModalSub from './ModalSub.svelte';

  export let modalID: string;
  export let dismissMode: 'backdrop' | 'anywhere' | 'none' = 'backdrop';

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

{#if $page.state.modal?.[modalID]}
  <ModalSub
    {dismissMode}
    on:dismiss={() => {
      closeModal();
    }}><slot /></ModalSub
  >
{/if}
