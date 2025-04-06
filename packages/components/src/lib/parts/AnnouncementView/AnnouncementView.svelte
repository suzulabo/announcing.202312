<script lang="ts">
  import type { Announcement } from './AnnouncementView';
  import DefaultAnnouncementView from './default/DefaultAnnouncementView.svelte';

  interface Props {
    announcement: Announcement;
  }

  let { announcement }: Props = $props();
</script>

<DefaultAnnouncementView {announcement} />
