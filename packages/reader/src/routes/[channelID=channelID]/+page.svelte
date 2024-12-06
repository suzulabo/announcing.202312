<script lang="ts">
  import ChannelView, { type ChannelViewProps } from '@announcing/components/ChannelView.svelte';

  import { page } from '$app/stores';
  import { fetchAnnouncement } from '$lib/fetch/fetchAnnouncement';

  import { createSnapshotContext } from '@announcing/components/utils';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  export const snapshot = createSnapshotContext();

  let channelViewProps = $derived({
    channel: data.channel,
    announcementHrefPrefix: $page.url.pathname,
    announcementKeys: data.channel.announcementIDs ?? [],
    announcementLoader: (key: string) => {
      return fetchAnnouncement({
        channelID: data.channelID,
        announcementID: key,
      });
    },
  } satisfies ChannelViewProps);
</script>

<ChannelView {...channelViewProps} />
