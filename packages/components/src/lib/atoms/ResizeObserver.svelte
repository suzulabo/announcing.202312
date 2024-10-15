<script lang="ts">
  import { onMount } from 'svelte';

  export let onResize: (params: { el: Element }) => void;

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

<div bind:this={wrapper}><slot /></div>

<style lang="scss">
  div {
    display: contents;
  }
</style>
