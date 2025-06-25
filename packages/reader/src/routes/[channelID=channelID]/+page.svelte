<script lang="ts">
  import ChannelView from '@announcing/components/ChannelView.svelte';

  import { page } from '$app/stores';
  import { fetchAnnouncement } from '$lib/fetch/fetchAnnouncement';

  import { createSnapshotContext } from '@announcing/components/snapshotContext';
  import type { PageData } from './$types';
  import type { ComponentProps } from 'svelte';

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
  } satisfies ComponentProps<typeof ChannelView>);
</script>

<svelte:head>
  <title>{data.channel.name}</title>
</svelte:head>

<ChannelView {...channelViewProps} />
