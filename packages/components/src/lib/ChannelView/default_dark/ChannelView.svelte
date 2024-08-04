<script lang="ts">
  import { onMount } from 'svelte';

  import DefaultChannelView from '../default/ChannelView.svelte';
  import type { ChannelViewParams } from '../types';

  export let params: ChannelViewParams;

  onMount(() => {
    document.documentElement.classList.add('dark');

    return () => {
      document.documentElement.classList.remove('dark');
    };
  });
</script>

<DefaultChannelView {params}><slot /></DefaultChannelView>
