<script lang="ts">
  import type { Announcement } from '@announcing/components/AnnouncementView.svelte';
  import type { ChannelViewParams } from '@announcing/components/ChannelView.svelte';
  import ChannelView from '@announcing/components/ChannelView.svelte';

  import { page } from '$app/stores';

  import type { PageData } from './$types';

  export let data: PageData;

  $: params = {
    channel: data.channel,
    announcementHrefPrefix: `${$page.url.pathname}/`,
    announcementKeys: data.channel.announcementIDs,
    announcementLoader: async (id: string) => {
      const res = await fetch(`/api/channels/${data.channel.channelID}/announcements/${id}`);
      if (res.ok) {
        const data = await res.json();
        return data as Announcement;
      }
      return;
    },
  } as ChannelViewParams;
</script>

<ChannelView {params} />
