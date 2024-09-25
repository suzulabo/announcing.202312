<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { browser } from '$app/environment';
  import { toStyle } from '$lib/utils/toStyle';

  export let dismissMode: 'backdrop' | 'anywhere' | 'none' = 'backdrop';
  export let padding = '8px';

  const eventDispatcher = createEventDispatcher();

  export let open = false;

  let bodyOverflow: string | undefined = undefined;

  $: (() => {
    if (!browser) {
      return;
    }

    if (open) {
      bodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } else {
      if (bodyOverflow) {
        document.body.style.overflow = bodyOverflow;
      }
      eventDispatcher('dismiss');
    }
  })();
</script>

<button
  class={`unstyled modal`}
  style={toStyle({ display: open ? undefined : 'none', padding })}
  on:click={() => {
    if (dismissMode === 'anywhere') {
      open = false;
    }
  }}
  on:click|self={() => {
    if (dismissMode === 'backdrop') {
      open = false;
    }
  }}
>
  <slot />
</button>

<svelte:window
  on:keydown={(event) => {
    if (event.key === 'Escape') {
      open = false;
    }
  }}
/>

<style lang="scss">
  .modal {
    cursor: default;
    display: flex;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    background-color: var(--color-background-modal);
    backdrop-filter: blur(1px);
    z-index: var(--modal-z-index, 999);
  }
</style>
