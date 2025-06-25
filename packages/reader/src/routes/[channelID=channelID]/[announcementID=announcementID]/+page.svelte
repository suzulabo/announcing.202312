<script lang="ts">
  import AnnouncementView from '@announcing/components/AnnouncementView.svelte';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<svelte:head>
  <title>{data.announcement.title ?? data.announcement.body}</title>
</svelte:head>

<AnnouncementView announcement={data.announcement} />
