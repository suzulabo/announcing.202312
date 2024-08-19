export type ChannelViewParams = {
  channel: {
    title: string;
    desc: string | null;
    icon: string | null;
    links?:
      | {
          name: string;
          url: string;
        }[]
      | null;
  };
  noAnnouncements?: boolean;
  settingsClick?: () => void;
  preview?: boolean;
};

export type AnnouncementViewParams = {
  announcement:
    | undefined
    | {
        id: string;
        headerImage?: string | undefined;
        title?: string | undefined;
        body: string;
        images?: string[] | undefined;
        links?: string[] | undefined;
        updatedAt: Date;
        createdAt: Date;
      };
};
