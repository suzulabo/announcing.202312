<script lang="ts" context="module">
  export type SnapShotData = {
    heightMap: Record<string | number, number>;
    scrollY: number;
  };
</script>

<script lang="ts" generics="T extends string | number">
  import { addSnapShot } from '$lib/utils/snapshotContext';

  import { afterUpdate, onMount } from 'svelte';

  import { toStyle } from '$lib/utils/toStyle';

  export let keys: T[];
  export let itemMinHeight: number;
  export let gap = 0;
  export let overScanCount = 2;

  let itemsY = -1;
  let visibleBottomY = -1;
  let totalHeight: number;
  let visibleKeys: T[] = [];
  let topHeight = 0;
  let itemsElement: HTMLDivElement | undefined;
  let heightMap = {} as Record<T, number>;
  let scrollYForRestore = -1;

  addSnapShot({
    capture: (): SnapShotData => {
      const data = { heightMap, scrollY: window.scrollY };
      return data;
    },
    restore: (data: SnapShotData) => {
      heightMap = data.heightMap;
      scrollYForRestore = data.scrollY;
    },
  });

  const updateItemsRect = () => {
    if (itemsElement) {
      const rect = itemsElement.getBoundingClientRect();
      itemsY = Math.max(0, rect.y * -1);
      visibleBottomY = itemsY + document.documentElement.clientHeight;
    }
  };

  $: {
    if (itemsElement && itemsY >= 0 && visibleBottomY >= 0) {
      const getItemHeight = (key: T) => {
        return heightMap[key] ?? itemMinHeight;
      };
      const startRow = (() => {
        let sumHeight = 0;
        for (const [i, key] of keys.entries()) {
          sumHeight += getItemHeight(key) + gap;
          if (sumHeight > itemsY) {
            return Math.max(0, i - overScanCount);
          }
        }
        return 0;
      })();

      topHeight = keys.slice(0, startRow).reduce((p, v) => {
        return p + getItemHeight(v) + gap;
      }, 0);

      const endRow = (() => {
        let sumHeight = topHeight;
        for (const [i, item] of keys.slice(startRow).entries()) {
          sumHeight += getItemHeight(item) + gap;
          if (sumHeight >= visibleBottomY) {
            return i + startRow + overScanCount;
          }
        }
        return keys.length - 1;
      })();

      const newVisibleKeys = keys.slice(startRow, endRow + 1);
      if (visibleKeys[0] !== newVisibleKeys[0] || visibleKeys.length !== newVisibleKeys.length) {
        visibleKeys = newVisibleKeys;
      } else {
        visibleKeys = newVisibleKeys;
      }

      totalHeight = Math.ceil(
        keys.reduce((p, v) => {
          return p + getItemHeight(v);
        }, 0) +
          (keys.length - 1) * gap,
      );
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

  afterUpdate(() => {
    if (scrollYForRestore >= 0 && itemsElement) {
      console.log({ itemHeight: itemsElement.style.height, totalHeight });
      if (itemsElement.style.height === `${totalHeight}px`) {
        console.log('restore scroll', scrollYForRestore);
        window.scrollTo({ top: scrollYForRestore });
        scrollYForRestore = -1;
      }
    }
  });

  type ElementWithItem = Element & { key?: T };

  const itemResize = (() => {
    let itemResizeObserver: ResizeObserver | undefined;

    onMount(() => {
      itemResizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const key = (entry.target as ElementWithItem).key;
          if (key) {
            if (heightMap[key] !== entry.contentRect.height) {
              heightMap[key] = entry.contentRect.height;
            }
          }
        }
      });

      return () => {
        itemResizeObserver?.disconnect();
      };
    });

    const action = (el: ElementWithItem, key: T) => {
      el.key = key;
      itemResizeObserver?.observe(el);

      return {
        update: (key: T) => {
          el.key = key;
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
  {#if visibleKeys}
    {#each visibleKeys as key (key)}
      <div class="item-box" use:itemResize={key}>
        <slot name="item" {key} />
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
