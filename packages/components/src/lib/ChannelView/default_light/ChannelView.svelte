<script lang="ts">
  import { onMount } from 'svelte';

  import DefaultChannelView from '../default/ChannelView.svelte';
  import type { ChannelViewParams } from '../types';

  export let params: ChannelViewParams;

  onMount(() => {
    document.documentElement.classList.add('light');
    return () => {
      document.documentElement.classList.remove('light');
    };
  });
</script>

<DefaultChannelView {params}><slot /></DefaultChannelView>
