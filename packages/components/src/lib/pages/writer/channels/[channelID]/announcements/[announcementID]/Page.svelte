<script lang="ts">
  import AnnouncementEditor, {
    type Announcement,
  } from '$lib/parts/AnnouncementEditor/AnnouncementEditor.svelte';

  export let announcement: Announcement;
</script>

<div class="container">
  <AnnouncementEditor {announcement} />
</div>

<style lang="scss">
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 8px;
  }
</style>
