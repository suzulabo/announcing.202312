<script lang="ts" generics="T">
  import { onDestroy, onMount } from 'svelte';

  import { toStyle } from '$lib/utils/toStyle';

  export let items: T[];
  export let itemHeight: number;
  export let itemMinWidth: number;
  export let gap = 0;
  export let overScanCount = 2;

  let cols = 0;
  let totalHeight: number;
  let visibleItems: T[] = [];
  let topHeight = 0;

  let itemsElement: HTMLDivElement;

  const updateVisibleItems = () => {
    cols = getComputedStyle(itemsElement).gridTemplateColumns.split(' ').length;

    if (cols === 0) {
      return;
    }

    const rect = itemsElement.getBoundingClientRect();

    const y = Math.max(0, rect.y * -1);
    const h = document.documentElement.clientHeight;

    const rows = Math.ceil(items.length / cols);

    const _startRow = Math.floor(y / (itemHeight + gap));
    const endRow = Math.ceil(_startRow + h / (itemHeight + gap)) + overScanCount;
    const startRow = Math.max(0, _startRow - overScanCount);

    const newVisibleItems = items.slice(startRow * cols, (endRow + 1) * cols);
    if (visibleItems[0] !== newVisibleItems[0] || visibleItems.length !== newVisibleItems.length) {
      visibleItems = newVisibleItems;
    }

    totalHeight = rows * itemHeight + (rows - 1) * gap;
    topHeight = startRow * itemHeight + (startRow - 1) * gap;
  };

  let resizeObserver: ResizeObserver | undefined;

  onMount(() => {
    resizeObserver = new ResizeObserver(() => {
      updateVisibleItems();
    });
    resizeObserver.observe(itemsElement);
  });

  onDestroy(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  });
</script>

<svelte:document
  on:scroll={() => {
    updateVisibleItems();
  }}
/>

<div
  bind:this={itemsElement}
  class="items"
  style={toStyle({
    'height': `${totalHeight}px`,
    'grid-template-columns': `repeat(auto-fit, minmax(${itemMinWidth}px, 1fr))`,
    'grid-auto-rows': `${itemHeight}px`,
    'gap': `${gap}px`,
    'padding-top': `${topHeight}px`,
  })}
>
  {#if visibleItems}
    {#each visibleItems as item}
      <slot name="item" {item} />
    {/each}
  {/if}
</div>

<style lang="scss">
  .items {
    width: 100%;
    display: grid;
  }
</style>
