<script lang="ts">
  import VirtualScrollList from '$lib/atoms/VirtualScrollList.svelte';
  import { toStyle } from '$lib/utils/toStyle';

  let virtualScrollList: VirtualScrollList<(typeof items)[number]>;

  let items = [...Array(20)].map((_, index) => {
    return { index, expand: false };
  });
</script>

<div class="container">
  <VirtualScrollList bind:this={virtualScrollList} {items} itemMinHeight={100} gap={0}>
    <!-- eslint-disable-next-line svelte/valid-compile -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="item"
      slot="item"
      let:item
      style={toStyle({ height: `${item.expand ? 200 : 100}px` })}
      role="button"
      tabindex="0"
      on:click={() => {
        items = items.map((v) => {
          if (v === item) {
            return { ...v, expand: !v.expand };
          }
          return v;
        });
      }}
    >
      <div>
        {item.index}
        {item.expand ? 'expand' : 'not expand'}
      </div>
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
      cursor: pointer;
      div {
        margin: auto;
      }
    }
  }
</style>
