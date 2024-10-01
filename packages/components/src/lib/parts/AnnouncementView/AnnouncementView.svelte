<script lang="ts" context="module">
  export type Announcement = {
    id: string;
    headerImage?: string | undefined;
    title?: string | undefined;
    body: string;
    images?: string[] | undefined;
    updatedAt: Date;
    createdAt: Date;
  };
</script>

<script lang="ts">
  import DefaultAnnouncementView from './default/DefaultAnnouncementView.svelte';

  export let announcement: Announcement;
</script>

<DefaultAnnouncementView {announcement} />
