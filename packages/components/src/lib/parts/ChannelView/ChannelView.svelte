<script lang="ts">
  import type { ChannelViewProps } from './ChannelView';
  import DefaultChannelView from './default/DefaultChannelView.svelte';

  let props: ChannelViewProps = $props();
</script>

<DefaultChannelView {...props} />
