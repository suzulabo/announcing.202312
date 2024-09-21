<script lang="ts" context="module">
  import DefaultAnnouncementPage from './themes/default/DefaultAnnouncementPage.svelte';

  const getPage = (theme: string) => {
    switch (theme) {
      case 'default_dark':
        // TODO
        break;
      case 'default_light':
        // TODO
        break;
    }

    return DefaultAnnouncementPage;
  };
</script>

<script lang="ts">
  import type { Announcement, Channel } from '$lib/ChannelPage/types';

  export let theme: string;
  export let channel: Channel;
  export let announcement: Announcement;
  export let backURL: string | undefined;

  $: Page = getPage(theme);
</script>

<svelte:component this={Page} {channel} {announcement} {backURL} />
