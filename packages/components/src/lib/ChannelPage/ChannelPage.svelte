<script lang="ts" context="module">
  import DefaultChannelPageView from './themes/default/DefaultChannelPageView.svelte';

  const getPageView = (viewName: string) => {
    switch (viewName) {
      case 'default_dark':
        // TODO
        break;
      case 'default_light':
        // TODO
        break;
    }

    return DefaultChannelPageView;
  };
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import type { AnnouncementLoaderFunction, Channel, SettingsClickFunction } from './types';

  export let viewName: string;
  export let channel: Channel;
  export let announcementKeys: string[] | undefined = undefined;
  export let announcementLoader: AnnouncementLoaderFunction | undefined = undefined;
  export let settingsClick: SettingsClickFunction | undefined = undefined;
  export let channelPreview: boolean | undefined = undefined;

  const eventDispatch = createEventDispatcher<{ announcementClick: string }>();

  const announcementClick = (key: string) => {
    eventDispatch('announcementClick', key);
  };

  $: PageView = getPageView(viewName);
</script>

<svelte:component
  this={PageView}
  {channel}
  announcementKeys={announcementKeys ?? []}
  {announcementLoader}
  {announcementClick}
  {settingsClick}
  {channelPreview}
/>
