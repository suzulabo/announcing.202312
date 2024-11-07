<script lang="ts">
  import { onMount, type Snippet } from 'svelte';

  interface Props {
    onResize: (params: { el: Element }) => void;
    children?: Snippet;
  }

  let { onResize, children }: Props = $props();

  let wrapper: HTMLDivElement;

  const observerCallback: ResizeObserverCallback = (entries) => {
    for (const entry of entries) {
      const el = entry.target;
      onResize({ el });
    }
  };

  onMount(() => {
    const observer = new ResizeObserver(observerCallback);

    for (const el of wrapper.children) {
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  });
</script>

<div bind:this={wrapper}>{@render children?.()}</div>

<style lang="scss">
  div {
    display: contents;
  }
</style>
