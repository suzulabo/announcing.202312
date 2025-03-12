<script lang='ts'>
  import type { PageData } from './$types'
  import AnnouncementView from '@announcing/components/AnnouncementView.svelte'

  interface Props {
    data: PageData
  }

  const { data }: Props = $props()
</script>

<div class='container'>
  <AnnouncementView announcement={data.announcement} />
</div>

<style lang='scss'>
  .container {
    margin: 16px 0;
  }
</style>
