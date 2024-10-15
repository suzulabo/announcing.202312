<script lang="ts" context="module">
  export type Announcement = {
    headerImage?: string | undefined;
    title?: string | undefined;
    body: string;
    images?: string[] | undefined;
    updatedAt: number;
    createdAt: number;
  };
</script>

<script lang="ts">
  import DefaultAnnouncementView from './default/DefaultAnnouncementView.svelte';

  export let announcement: Announcement;
</script>

<DefaultAnnouncementView {announcement} />
