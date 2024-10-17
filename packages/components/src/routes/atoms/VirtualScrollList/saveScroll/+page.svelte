<script lang="ts">
  import { page } from '$app/stores';
  import VirtualScrollList, { type SnapShotData } from '$lib/atoms/VirtualScrollList.svelte';
  import type { Snapshot } from '../$types';

  import { items } from './items';

  let scrollList: VirtualScrollList<(typeof items)[number], 'index'>;

  export const snapshot: Snapshot<SnapShotData> = {
    capture: () => {
      return scrollList.snapshot.capture();
    },
    restore: (data) => {
      scrollList.snapshot.restore(data);
    },
  };
</script>

<div class="container">
  <div class="forward-box">
    <a href={`${$page.url.href}/back`}>Forward</a>
  </div>
  <VirtualScrollList bind:this={scrollList} {items} idKey="index" itemMinHeight={100}>
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
