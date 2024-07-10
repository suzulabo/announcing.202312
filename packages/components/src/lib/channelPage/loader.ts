import type AnnouncementView from './default/AnnouncementView.svelte';
import type ChannelPage from './default/ChannelPage.svelte';

export interface ChannelPageData {
  channel: {
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
    createdAt: Date;
  };
}

export interface AnnouncementViewData {
  announcement: {
    id: string;
    headerImage?: string;
    title?: string;
    body: string;
    images?: string[];
    links?: string[];
    updatedAt: Date;
    createdAt: Date;
  };
}

export const loadChannelPageComponents = async (): Promise<{
  Page: typeof ChannelPage;
  AnnouncementView: typeof AnnouncementView;
}> => {
  return {
    Page: (await import('./default/ChannelPage.svelte')).default,
    AnnouncementView: (await import('./default/AnnouncementView.svelte')).default,
  };
};
