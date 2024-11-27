<script lang="ts">
  import AnnouncementView from '@announcing/components/AnnouncementView.svelte';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<AnnouncementView announcement={data.announcement} />
