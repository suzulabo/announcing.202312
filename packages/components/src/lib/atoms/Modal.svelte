<script lang="ts" module>
  export type DismissMode = 'backdrop' | 'anywhere' | 'none';
</script>

<script lang="ts">
  import { onDestroy, type Snippet } from 'svelte';

  import { browser } from '$app/environment';
  import { toStyle } from '$lib/utils/toStyle';

  interface Props {
    dismissMode?: 'backdrop' | 'anywhere' | 'none';
    padding?: string;
    open?: boolean;
    onDismiss?: () => void;
    children?: Snippet;
  }

  let {
    dismissMode = 'backdrop',
    padding = '8px',
    open = $bindable(false),
    onDismiss,
    children,
  }: Props = $props();

  let bodyOverflow: string | undefined = $state(undefined);

  $effect(() => {
    if (!browser) {
      return;
    }

    if (open) {
      bodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } else {
      if (bodyOverflow) {
        document.body.style.overflow = bodyOverflow;
      } else {
        document.body.style.removeProperty('overflow');
      }
    }
  });

  onDestroy(() => {
    if (!browser) {
      return;
    }
    if (bodyOverflow) {
      document.body.style.overflow = bodyOverflow;
    } else {
      document.body.style.removeProperty('overflow');
    }
  });

  const clickHandler = (event: MouseEvent) => {
    if (dismissMode === 'anywhere') {
      open = false;
      onDismiss?.();
    } else if (dismissMode === 'backdrop' && event.target === event.currentTarget) {
      open = false;
      onDismiss?.();
    }
  };
</script>

<div
  role="button"
  tabindex="0"
  class="modal"
  style={toStyle({ display: open ? undefined : 'none', padding })}
  onclick={clickHandler}
  onkeydown={() => {
    // TODO
  }}
>
  {@render children?.()}
</div>

<svelte:window
  onkeydown={(event) => {
    if (event.key === 'Escape') {
      open = false;
      onDismiss?.();
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
    z-index: var(--modal-z-index, 999);
  }
</style>
