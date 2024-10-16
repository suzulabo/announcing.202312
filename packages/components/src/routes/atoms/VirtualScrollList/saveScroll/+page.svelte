<script lang="ts">
  import { page } from '$app/stores';
  import VirtualScrollList from '$lib/atoms/VirtualScrollList.svelte';
  import type { Snapshot } from '../$types';

  import { items } from './items';

  let heightMap = {};
  let onTotalHeightChanged: (() => void) | undefined = undefined;

  export const snapshot: Snapshot<{ heightMap: Record<string, number>; scrollY: number }> = {
    capture: () => {
      console.log('capture', { heightMap, scrollY: window.scrollY });
      return { heightMap, scrollY: document.documentElement.scrollTop };
    },
    restore: async (value) => {
      console.log('restore', value);
      heightMap = value.heightMap;

      const scrollY = value.scrollY;
      onTotalHeightChanged = () => {
        console.log('onTotalHeightChanged', scrollY);
        window.scrollTo({ top: scrollY });
        onTotalHeightChanged = undefined;
      };
    },
  };
</script>

<div class="container">
  <div class="forward-box">
    <a href={`${$page.url.href}/back`}>Forward</a>
  </div>
  <VirtualScrollList
    {items}
    idKey="index"
    itemMinHeight={100}
    bind:heightMap
    {onTotalHeightChanged}
  >
    <div class="item" slot="item" let:item>
      <div class="title">{item.title}</div>
      <div class="body">{item.body}</div>
      <hr />
    </div>
  </VirtualScrollList>
</div>

<style lang="scss">
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 8px;

    .forward-box {
      top: 0px;
      position: sticky;
      margin: 0 0 8px 0;
      background-color: var(--color-background-light);
      padding: 8px;
    }

    .item {
      overflow: hidden;
      .title {
        margin: 0 0 8px;
        font-weight: bold;
        font-size: 18px;
      }
      .body {
        white-space: pre-wrap;
        line-height: 1.5;
      }
      hr {
        margin: 8px 0;
      }
    }
  }
</style>
