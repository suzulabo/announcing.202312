<script lang="ts">
  import { onMount } from 'svelte';

  import DefaultChannelView from '../default/ChannelView.svelte';
  import type { ChannelViewParams } from '../types';

  export let params: ChannelViewParams;

  onMount(() => {
    document.documentElement.setAttribute('data-color-scheme', 'dark');
    return () => {
      document.documentElement.removeAttribute('data-color-scheme');
    };
  });
</script>

<DefaultChannelView {params}><slot /></DefaultChannelView>
