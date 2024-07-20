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
