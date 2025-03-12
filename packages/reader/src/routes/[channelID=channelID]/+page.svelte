<script lang='ts'>
  import type { ChannelViewProps } from '@announcing/components/ChannelView.svelte'

  import type { PageData } from './$types'
  import { page } from '$app/stores'

  import { fetchAnnouncement } from '$lib/fetch/fetchAnnouncement'
  import ChannelView from '@announcing/components/ChannelView.svelte'
  import { createSnapshotContext } from '@announcing/components/utils'

  interface Props {
    data: PageData
  }

  const { data }: Props = $props()

  export const snapshot = createSnapshotContext()

  const channelViewProps = $derived({
    channel: data.channel,
    announcementHrefPrefix: $page.url.pathname,
    announcementKeys: data.channel.announcementIDs ?? [],
    announcementLoader: (key: string) => {
      return fetchAnnouncement({
        channelID: data.channelID,
        announcementID: key,
      })
    },
  } satisfies ChannelViewProps)
</script>

<ChannelView {...channelViewProps} />
