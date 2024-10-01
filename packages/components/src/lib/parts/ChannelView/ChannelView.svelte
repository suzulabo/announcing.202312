<script lang="ts" context="module">
  import type { Announcement } from '../AnnouncementView/AnnouncementView.svelte';

  export type Channel = {
    name: string;
    desc: string | undefined;
    icon: string | undefined;
  };

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  export type AnnouncementLoaderFunction = (key: string) => Promise<Announcement> | Announcement;

  export type ChannelViewParams = {
    channel: Channel;
    announcementKeys?: string[];
    announcementLoader?: AnnouncementLoaderFunction;
    onAnnouncementClick?: (key: string) => void;
  };
</script>

<script lang="ts">
  import DefaultChannelView from './default/DefaultChannelView.svelte';

  export let params: ChannelViewParams;
</script>

<DefaultChannelView {params} />
