<script lang="ts" generics="T">
  import { onMount } from 'svelte';

  import { toStyle } from '$lib/utils/toStyle';

  export let items: T[];
  export let itemMinHeight: number;
  export let gap = 0;
  export let overScanCount = 2;

  const heightMap = new Map<T, number>();

  let totalHeight: number;
  let visibleItems: T[] = [];
  let topHeight = 0;
  let itemsElement: HTMLDivElement | undefined;

  export const invalidateItems = () => {
    items = [...items];
  };

  const updateVisibleItems = (items: T[]) => {
    if (!itemsElement) {
      return;
    }

    const getItemHeight = (item: T) => {
      return heightMap.get(item) ?? itemMinHeight;
    };

    const rect = itemsElement.getBoundingClientRect();

    const y = Math.max(0, rect.y * -1);
    const visibleBottomY = y + document.documentElement.clientHeight;

    const startRow = (() => {
      let sumHeight = 0;
      for (const [i, item] of items.entries()) {
        sumHeight += getItemHeight(item) + gap;
        if (sumHeight > y) {
          return Math.max(0, i - overScanCount);
        }
      }
      return 0;
    })();

    topHeight = items.slice(0, startRow).reduce((p, v) => {
      return p + getItemHeight(v) + gap;
    }, 0);

    const endRow = (() => {
      let sumHeight = topHeight;
      for (const [i, item] of items.slice(startRow).entries()) {
        sumHeight += getItemHeight(item) + gap;
        if (sumHeight >= visibleBottomY) {
          return i + startRow + overScanCount;
        }
      }
      return items.length - 1;
    })();

    const newVisibleItems = items.slice(startRow, endRow + 1);
    if (visibleItems[0] !== newVisibleItems[0] || visibleItems.length !== newVisibleItems.length) {
      visibleItems = newVisibleItems;
    } else {
      visibleItems = newVisibleItems;
    }

    totalHeight =
      items.reduce((p, v) => {
        return p + getItemHeight(v);
      }, 0) +
      (items.length - 1) * gap;
  };

  $: updateVisibleItems(items);

  onMount(() => {
    const resizeObserver = new ResizeObserver(() => {
      console.log('resize itemsElement');
      invalidateItems();
    });
    if (itemsElement) {
      resizeObserver.observe(itemsElement);
    }

    return () => {
      resizeObserver.disconnect();
    };
  });

  const itemResize = (() => {
    const elMap = new Map<Element, T>();

    let itemResizeObserver: ResizeObserver | undefined;

    onMount(() => {
      itemResizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const item = elMap.get(entry.target);
          if (item) {
            heightMap.set(item, entry.contentRect.height);
          }
        }
        console.log('resize item');
        invalidateItems();
      });

      return () => {
        itemResizeObserver?.disconnect();
      };
    });

    const result = (el: Element, item: T) => {
      elMap.set(el, item);
      itemResizeObserver?.observe(el);

      console.log('item mount');
      invalidateItems();

      return {
        update: (item: T) => {
          elMap.set(el, item);
        },
        destroy: () => {
          itemResizeObserver?.unobserve(el);
          elMap.delete(el);
        },
      };
    };

    return result;
  })();
</script>

<svelte:document
  on:scroll={() => {
    invalidateItems();
  }}
/>

<div
  bind:this={itemsElement}
  class="items"
  style={toStyle({
    'height': `${totalHeight}px`,
    'gap': `${gap}px`,
    'padding-top': `${topHeight}px`,
  })}
>
  {#if visibleItems}
    {#each visibleItems as item (item)}
      <div class="item-box" use:itemResize={item}>
        <slot name="item" {item} />
      </div>
    {/each}
  {/if}
</div>

<style lang="scss">
  .items {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
