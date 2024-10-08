<script lang="ts">
  import VirtualScrollList from '$lib/atoms/VirtualScrollList.svelte';

  import { items } from './items';
</script>

<div class="container">
  <VirtualScrollList {items} itemMinHeight={100}>
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
