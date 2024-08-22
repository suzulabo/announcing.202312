<script lang="ts" generics="T">
  import { onDestroy, onMount } from 'svelte';

  import { toStyle } from './utils/toStyle';

  export let items: T[];
  export let itemHeight: number;
  export let itemMinWidth: number;
  export let gap = 0;
  export let renderMargin = 50;

  let cols = 0;
  let totalHeight: number;
  let visibleItems: T[];
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

    const startRow = Math.max(0, Math.floor((y - renderMargin + gap) / (itemHeight + gap)));
    const endRow = Math.ceil(startRow + (h + renderMargin) / (itemHeight + gap));

    visibleItems = items.slice(startRow * cols, (endRow + 1) * cols);
    totalHeight = rows * itemHeight + (rows - 1) * gap;
    topHeight = startRow * itemHeight + (startRow - 1) * gap;

    console.log({ cols, rows, startRow, endRow, length: visibleItems.length, totalHeight });
  };

  let resizeObserver: ResizeObserver;

  onMount(() => {
    resizeObserver = new ResizeObserver(() => {
      updateVisibleItems();
    });
    resizeObserver.observe(itemsElement);
  });

  onDestroy(() => {
    resizeObserver.disconnect();
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
      <div class="item">
        <slot name="item" {item} />
      </div>
    {/each}
  {/if}
</div>

<style lang="scss">
  .items {
    width: 100%;
    display: grid;

    .item {
      overflow: hidden;
    }
  }
</style>
