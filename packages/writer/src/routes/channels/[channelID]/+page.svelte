<script lang="ts">
  import ChannelPage from '@announcing/components/ChannelPage.svelte';

  import type { PageData } from './$types';

  export let data: PageData;
</script>

<ChannelPage theme="default" channel={data.channel} channelPreview={true} />
