import DefaultAnnouncementView from './default/AnnouncementView.svelte';
import DefaultChannelView from './default/ChannelView.svelte';
import DefaultDarkChannelView from './default_dark/ChannelView.svelte';

export const loadChannelViewComponents = (name: string) => {
  switch (name) {
    case 'default_dark':
      return {
        ChannelView: DefaultDarkChannelView,
        AnnouncementView: DefaultAnnouncementView,
      };
  }

  return {
    ChannelView: DefaultChannelView,
    AnnouncementView: DefaultAnnouncementView,
  };
};
