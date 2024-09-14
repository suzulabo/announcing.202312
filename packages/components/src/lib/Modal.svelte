<script lang="ts">
  import { pushState } from '$app/navigation';
  import { page } from '$app/stores';

  import ModalSub from './ModalSub.svelte';

  export let modalID: string | undefined = undefined;
  export let dismissMode: 'backdrop' | 'anywhere' | 'none' = 'backdrop';

  let visible = false;

  export const showModal = () => {
    visible = true;
    if (modalID) {
      const pageState = $page.state;
      if (!pageState.modal?.[modalID]) {
        const modal = pageState.modal ?? {};
        modal[modalID] = true;
        pushState('', { ...pageState, modal });
      }
    }
  };

  export const closeModal = () => {
    visible = false;
    if (modalID) {
      const pageState = $page.state;
      if (pageState.modal?.[modalID]) {
        history.back();
      }
    }
  };
</script>

{#if visible}
  <ModalSub
    {dismissMode}
    on:dismiss={() => {
      closeModal();
    }}><slot /></ModalSub
  >
{/if}
