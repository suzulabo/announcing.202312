<script lang="ts">
  import type { ChannelViewParams } from '$lib/parts/ChannelView/ChannelView.svelte';
  import ChannelView from '$lib/parts/ChannelView/ChannelView.svelte';

  export let params: ChannelViewParams;
</script>

<div class="container">
  <ChannelView {params} />
</div>

<style lang="scss">
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 8px;
  }
</style>
