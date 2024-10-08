<script lang="ts">
  import VirtualScrollList from '$lib/atoms/VirtualScrollList.svelte';
  import { toStyle } from '$lib/utils/toStyle';

  const items = [...Array(20)].map((_, index) => {
    return { index };
  });
</script>

<div class="container">
  <VirtualScrollList {items} itemMinHeight={100} gap={0}>
    <div
      class="item"
      slot="item"
      let:item
      style={toStyle({ height: `${100 + item.index * 10}px` })}
    >
      <div>{item.index}</div>
    </div>
  </VirtualScrollList>
</div>

<style lang="scss">
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 8px;

    .item {
      border: 1px solid black;
      display: flex;
      div {
        margin: auto;
      }
    }
  }
</style>
