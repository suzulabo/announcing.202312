<script lang="ts" context="module">
  import DefaultChannelPage from './themes/default/DefaultChannelPage.svelte';

  const getPage = (theme: string) => {
    switch (theme) {
      case 'default_dark':
        // TODO
        break;
      case 'default_light':
        // TODO
        break;
    }

    return DefaultChannelPage;
  };
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import type { AnnouncementLoaderFunction, Channel, SettingsClickFunction } from './types';

  export let theme: string;
  export let channel: Channel;
  export let announcementKeys: string[] | undefined = undefined;
  export let announcementLoader: AnnouncementLoaderFunction | undefined = undefined;
  export let settingsClick: SettingsClickFunction | undefined = undefined;
  export let channelPreview: boolean | undefined = undefined;

  const eventDispatch = createEventDispatcher<{ announcementClick: string }>();

  const announcementClick = (key: string) => {
    eventDispatch('announcementClick', key);
  };

  $: Page = getPage(theme);
</script>

<svelte:component
  this={Page}
  {channel}
  announcementKeys={announcementKeys ?? []}
  {announcementLoader}
  {announcementClick}
  {settingsClick}
  {channelPreview}
/>
