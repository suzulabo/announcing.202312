<script lang="ts">
  import DefaultAnnouncementView from './default/DefaultAnnouncementView.svelte';
  import type { AnnouncementViewProps } from './types';

  let { announcement }: AnnouncementViewProps = $props();
</script>

<DefaultAnnouncementView {announcement} />
