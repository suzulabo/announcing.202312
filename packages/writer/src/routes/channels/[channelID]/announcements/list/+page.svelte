<script lang='ts'>
  import type { ChannelViewProps } from '@announcing/components/ChannelView.svelte'

  import type { PageData } from './$types'
  import { page } from '$app/stores'

  import { fetchAnnouncement } from '$lib/fetch/fetchAnnouncement'
  import ChannelView from '@announcing/components/ChannelView.svelte'
  import { createSnapshotContext } from '@announcing/components/utils'
  import { LL } from '@announcing/i18n'

  interface Props {
    data: PageData
  }

  const { data }: Props = $props()

  export const snapshot = createSnapshotContext()

  const channelViewProps = $derived<ChannelViewProps>({
    channel: data.channel,
    announcementHrefPrefix: $page.url.pathname,
    announcementKeys: data.channel.announcementIDs ?? [],
    announcementLoader: (key: string) => {
      return fetchAnnouncement({
        channelID: $page.params.channelID as string,
        announcementID: key,
      })
    },
  })
</script>

<div class='menu'>
  <div class='prompt info'>{$LL.announcementListPrompt()}</div>
</div>
<ChannelView {...channelViewProps} />

<style lang='scss'>
  .menu {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 16px 8px;
    border-bottom: 1px solid var(--color-border-light);
    margin-bottom: 16px;
    .prompt {
      margin: auto;
    }
  }
</style>
