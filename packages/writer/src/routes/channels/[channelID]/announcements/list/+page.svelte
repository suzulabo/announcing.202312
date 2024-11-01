<script lang="ts">
  import ChannelView, { type ChannelViewParams } from '@announcing/components/ChannelView.svelte';

  import { page } from '$app/stores';
  import { fetchAnnouncement } from '$lib/fetch/fetchAnnouncement';

  import type { PageData } from './$types';

  export let data: PageData;

  $: params = {
    channel: data.channel,
    announcementHrefPrefix: $page.url.pathname,
    announcementKeys: data.channel.announcementIDs ?? [],
    announcementLoader: (key: string) => {
      return fetchAnnouncement({
        channelID: $page.params['channelID'] as string,
        announcementID: key,
      });
    },
  } satisfies ChannelViewParams;
</script>

<div class="container">
  <ChannelView {params} />
</div>

<style lang="scss">
  .container {
    padding: 8px;
  }
</style>
