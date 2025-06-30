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

<div class="favorite">
  <button class="small">お気に入りに追加</button>
</div>
<ChannelView {...channelViewProps} />

<style lang="scss">
  .favorite {
    margin: 16px;
    text-align: end;
  }
</style>
