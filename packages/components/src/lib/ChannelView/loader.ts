import type AnnouncementView from './default/AnnouncementView.svelte';
import type ChannelView from './default/ChannelView.svelte';

export const loadChannelViewComponents = async (): Promise<{
  ChannelView: typeof ChannelView;
  AnnouncementView: typeof AnnouncementView;
}> => {
  return {
    ChannelView: (await import('./default/ChannelView.svelte')).default,
    AnnouncementView: (await import('./default/AnnouncementView.svelte')).default,
  };
};
