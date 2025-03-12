<script lang='ts' module>
  import type { Announcement } from '../AnnouncementView/AnnouncementView.svelte'

  export type Channel = {
    name: string
    desc: string | undefined
    icon: string | undefined
  }

  export type AnnouncementLoaderFunction = (
    key: string,
  ) => Promise<Announcement | undefined> | Announcement | undefined

  export type ChannelViewProps = {
    channel: Channel
    announcementHrefPrefix: string
    announcementKeys?: string[]
    announcementLoader?: AnnouncementLoaderFunction
  }
</script>

<script lang='ts'>
  import DefaultChannelView from './default/DefaultChannelView.svelte'

  const props: ChannelViewProps = $props()
</script>

<DefaultChannelView {...props} />
