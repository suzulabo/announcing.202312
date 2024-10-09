<script lang="ts" generics="T extends Record<K, string | number>, K extends keyof T">
  import { onMount } from 'svelte';

  import { toStyle } from '$lib/utils/toStyle';

  export let items: T[];
  export let idKey: K;
  export let itemMinHeight: number;
  export let gap = 0;
  export let overScanCount = 2;

  let itemsY = -1;
  let visibleBottomY = -1;
  let totalHeight: number;
  let visibleItems: T[] = [];
  let topHeight = 0;
  let itemsElement: HTMLDivElement | undefined;

  const heightMap: Record<string | number, number> = {};

  const updateItemsRect = () => {
    if (itemsElement) {
      const rect = itemsElement.getBoundingClientRect();
      itemsY = Math.max(0, rect.y * -1);
      visibleBottomY = itemsY + document.documentElement.clientHeight;
    }
  };

  $: {
    if (itemsElement && itemsY >= 0 && visibleBottomY >= 0) {
      const getItemHeight = (item: T) => {
        return heightMap[item[idKey]] ?? itemMinHeight;
      };
      const startRow = (() => {
        let sumHeight = 0;
        for (const [i, item] of items.entries()) {
          sumHeight += getItemHeight(item) + gap;
          if (sumHeight > itemsY) {
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
      if (
        visibleItems[0] !== newVisibleItems[0] ||
        visibleItems.length !== newVisibleItems.length
      ) {
        visibleItems = newVisibleItems;
      } else {
        visibleItems = newVisibleItems;
      }

      totalHeight =
        items.reduce((p, v) => {
          return p + getItemHeight(v);
        }, 0) +
        (items.length - 1) * gap;

      console.log('##update', { startRow, endRow, visibleBottomY });
    }
  }

  onMount(() => {
    const resizeObserver = new ResizeObserver(updateItemsRect);
    if (itemsElement) {
      resizeObserver.observe(itemsElement);
    }

    return () => {
      resizeObserver.disconnect();
    };
  });

  type ElementWithItem = Element & { item?: T };

  const itemResize = (() => {
    let itemResizeObserver: ResizeObserver | undefined;

    onMount(() => {
      itemResizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const item = (entry.target as ElementWithItem).item;
          if (item) {
            if (heightMap[item[idKey]] !== entry.contentRect.height) {
              heightMap[item[idKey]] = entry.contentRect.height;
            }
          }
        }
      });

      return () => {
        itemResizeObserver?.disconnect();
      };
    });

    const action = (el: ElementWithItem, item: T) => {
      el.item = item;
      itemResizeObserver?.observe(el);

      return {
        update: (item: T) => {
          el.item = item;
        },
        destroy: () => {
          itemResizeObserver?.unobserve(el);
        },
      };
    };

    return action;
  })();
</script>

<svelte:document on:scroll={updateItemsRect} />

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
    {#each visibleItems as item (item[idKey])}
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
