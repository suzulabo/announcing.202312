import DefaultAnnouncementView from './default/AnnouncementView.svelte';
import DefaultChannelView from './default/ChannelView.svelte';
import DefaultDarkChannelView from './default_dark/ChannelView.svelte';
import DefaultLightChannelView from './default_light/ChannelView.svelte';

export const loadChannelViewComponents = (name: string) => {
  switch (name) {
    case 'default_dark':
      return {
        ChannelView: DefaultDarkChannelView,
        AnnouncementView: DefaultAnnouncementView,
      };
    case 'default_light':
      return {
        ChannelView: DefaultLightChannelView,
        AnnouncementView: DefaultAnnouncementView,
      };
  }

  return {
    ChannelView: DefaultChannelView,
    AnnouncementView: DefaultAnnouncementView,
  };
};
