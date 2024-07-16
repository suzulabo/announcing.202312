import type AnnouncementView from './default/AnnouncementView.svelte';
import type ChannelView from './default/ChannelView.svelte';

export type ChannelProp = {
  title: string;
  desc: string | null;
  icon: string | null;
  links:
    | {
        name: string;
        url: string;
      }[]
    | null;
  count: number;
};

export type AnnouncementProp = {
  id: string;
  headerImage?: string | undefined;
  title?: string | undefined;
  body: string;
  images?: string[] | undefined;
  links?: string[] | undefined;
  updatedAt: Date;
  createdAt: Date;
};

export const loadChannelPageComponents = async (): Promise<{
  ChannelView: typeof ChannelView;
  AnnouncementView: typeof AnnouncementView;
}> => {
  return {
    ChannelView: (await import('./default/ChannelView.svelte')).default,
    AnnouncementView: (await import('./default/AnnouncementView.svelte')).default,
  };
};
