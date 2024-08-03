<script lang="ts">
  import { onMount } from 'svelte';

  import ChannelView from '../default/ChannelView.svelte';
  import type { ChannelViewParams } from '../types';

  export let params: ChannelViewParams;

  onMount(() => {
    console.log('mount');
  });
</script>

<svelte:window
  on:load={() => {
    console.log('load');
  }}
/>

<ChannelView {params} />
