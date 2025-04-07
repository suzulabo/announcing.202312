<script lang="ts">
  import DefaultAnnouncementView from './default/DefaultAnnouncementView.svelte';

  type Announcement = {
    headerImage?: string | undefined;
    title?: string | undefined;
    body: string;
    images?: string[] | undefined;
    updatedAt: number;
    createdAt: number;
  };

  interface Props {
    announcement: Announcement;
  }

  let { announcement }: Props = $props();
</script>

<DefaultAnnouncementView {announcement} />
