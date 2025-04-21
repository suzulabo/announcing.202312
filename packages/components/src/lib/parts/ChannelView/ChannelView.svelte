<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import AnnouncementView from '../AnnouncementView/AnnouncementView.svelte';
  import DefaultChannelView from './default/DefaultChannelView.svelte';

  type Channel = {
    name: string;
    desc: string | undefined;
    icon: string | undefined;
  };

  type Announcement = ComponentProps<typeof AnnouncementView>['announcement'];

  type AnnouncementLoaderFunction = (
    key: string,
  ) => Promise<Announcement | undefined> | Announcement | undefined;

  type ChannelViewProps = {
    channel?: Channel;
    announcementHrefPrefix: string;
    announcementKeys?: string[];
    announcementLoader?: AnnouncementLoaderFunction;
  };

  let props: ChannelViewProps = $props();
</script>

<DefaultChannelView {...props} />
