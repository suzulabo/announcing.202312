<script lang="ts">
  import type { Announcement } from './default/DefaultAnnouncementView.svelte';
  import DefaultAnnouncementView from './default/DefaultAnnouncementView.svelte';

  export let announcement: Announcement;
</script>

<DefaultAnnouncementView {announcement} />
