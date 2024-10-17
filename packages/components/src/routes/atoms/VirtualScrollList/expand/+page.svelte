<script lang="ts">
  import VirtualScrollList from '$lib/atoms/VirtualScrollList.svelte';
  import { toStyle } from '$lib/utils/toStyle';

  const keys = [...Array(20)].map((_, index) => {
    return index;
  });

  const expands: Record<number, boolean> = {};
</script>

<div class="container">
  <VirtualScrollList {keys} itemMinHeight={100} gap={0}>
    <!-- eslint-disable-next-line svelte/valid-compile -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="item"
      slot="item"
      let:key
      style={toStyle({ height: `${expands[key] ? 200 : 100}px` })}
      role="button"
      tabindex="0"
      on:click={() => {
        expands[key] = !expands[key];
      }}
    >
      <div>
        {key}
        {expands[key] ? 'expand' : 'not expand'}
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
