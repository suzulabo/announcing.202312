<script lang='ts' module>
  export type Announcement = {
    headerImage?: string | undefined
    title?: string | undefined
    body: string
    images?: string[] | undefined
    updatedAt: number
    createdAt: number
  }
</script>

<script lang='ts'>
  import DefaultAnnouncementView from './default/DefaultAnnouncementView.svelte'

  interface Props {
    announcement: Announcement
  }

  const { announcement }: Props = $props()
</script>

<DefaultAnnouncementView {announcement} />
