<script lang="ts" generics="T">
  import { onMount } from 'svelte';
  import type { Action } from 'svelte/action';

  import { toStyle } from '$lib/utils/toStyle';

  export let items: T[];
  export let itemMinHeight: number;
  export let gap = 0;
  export let overScanCount = 2;

  type ItemDetail = (typeof itemDetails)[number];

  let totalHeight: number;
  let visibleItems: ItemDetail[] = [];
  let topHeight = 0;
  let itemsElement: HTMLDivElement | undefined;

  $: itemDetails = items.map((item) => {
    return { item, height: itemMinHeight };
  });
  $: updateVisibleItems(itemDetails);

  const updateVisibleItems = (itemDetails: ItemDetail[]) => {
    if (!itemsElement) {
      return;
    }

    const rect = itemsElement.getBoundingClientRect();

    const y = Math.max(0, rect.y * -1);
    const visibleBottomY = y + document.documentElement.clientHeight;

    const startRow = (() => {
      let sumHeight = 0;
      for (const [i, detail] of itemDetails.entries()) {
        sumHeight += detail.height + gap;
        if (sumHeight > y) {
          return Math.max(0, i - overScanCount);
        }
      }
      topHeight = 0;
      return 0;
    })();

    topHeight = itemDetails.slice(0, startRow).reduce((p, v) => {
      return p + v.height + gap;
    }, 0);

    const endRow = (() => {
      let sumHeight = topHeight;
      for (const [i, detail] of itemDetails.slice(startRow).entries()) {
        sumHeight += detail.height + gap;
        if (sumHeight >= visibleBottomY) {
          return i + startRow + overScanCount;
        }
      }
      return itemDetails.length - 1;
    })();

    const newVisibleItems = itemDetails.slice(startRow, endRow + 1);
    if (visibleItems[0] !== newVisibleItems[0] || visibleItems.length !== newVisibleItems.length) {
      visibleItems = newVisibleItems;
    }

    totalHeight =
      itemDetails.reduce((p, v) => {
        return p + v.height;
      }, 0) +
      (itemDetails.length - 1) * gap;
  };

  const updateItemDetails = () => {
    itemDetails = [...itemDetails];
  };

  onMount(() => {
    const resizeObserver = new ResizeObserver(() => {
      updateItemDetails();
    });
    if (itemsElement) {
      resizeObserver.observe(itemsElement);
    }

    return () => {
      resizeObserver.disconnect();
    };
  });

  const itemResize = (() => {
    const elMap = new Map<Element, ItemDetail>();

    let itemResizeObserver: ResizeObserver | undefined;

    onMount(() => {
      itemResizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const itemDetail = elMap.get(entry.target);
          if (itemDetail) {
            itemDetail.height = entry.contentRect.height;
          }
        }
        updateItemDetails();
      });

      return () => {
        itemResizeObserver?.disconnect();
      };
    });

    const result: Action<Element, ItemDetail> = (el, itemDetail: ItemDetail) => {
      elMap.set(el, itemDetail);
      itemResizeObserver?.observe(el);

      updateItemDetails();

      return {
        update: (itemDetail) => {
          elMap.set(el, itemDetail);
          updateItemDetails();
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
    itemDetails = [...itemDetails];
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
    {#each visibleItems as detail (detail)}
      <div class="item-box" use:itemResize={detail}>
        <slot name="item" item={detail.item} />
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
