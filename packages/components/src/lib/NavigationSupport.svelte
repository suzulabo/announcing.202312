<script lang="ts">
  import { get } from 'svelte/store';

  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  export const documentClickCapture = (event: MouseEvent) => {
    if (!event.target) {
      return;
    }

    const target = (event.target as HTMLElement).closest('a');
    if (target) {
      const pageStore = get(page);
      if (pageStore.state.fromHref === target.href) {
        event.stopImmediatePropagation();
        event.preventDefault();
        history.back();
        return;
      }

      if (new URL(target.href).origin === location.origin) {
        event.stopImmediatePropagation();
        event.preventDefault();
        void goto(target.href, {
          state: {
            fromHref: location.href,
          },
        });
      }
    }
  };
</script>

<svelte:document on:click|capture={documentClickCapture} />
