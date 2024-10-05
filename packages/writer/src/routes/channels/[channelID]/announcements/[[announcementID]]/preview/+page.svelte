<script lang="ts">
  import AnnouncementView from '@announcing/components/AnnouncementView.svelte';
  import type { GetAnnouncementResult } from '@announcing/db/types';
  import { onMount } from 'svelte';

  import { page } from '$app/stores';

  import type { Snapshot } from '../$types';

  let announcement: GetAnnouncementResult | undefined;

  onMount(() => {
    announcement = $page.state.announcementPreviewData;
  });

  export const snapshot: Snapshot<GetAnnouncementResult | undefined> = {
    capture: () => announcement,
    restore: (value) => {
      const previewData = $page.state.announcementPreviewData;
      if (previewData) {
        announcement = previewData;
      } else {
        announcement = value;
      }
    },
  };
</script>

{#if announcement}
  <AnnouncementView {announcement} />
{/if}
