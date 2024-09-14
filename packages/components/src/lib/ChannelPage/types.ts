export type Channel = {
  title: string;
  desc: string | undefined;
  icon: string | undefined;
};

export type Announcement = {
  id: string;
  headerImage?: string | undefined;
  title?: string | undefined;
  body: string;
  images?: string[] | undefined;
  updatedAt: Date;
  createdAt: Date;
};

export type AnnouncementLoaderFunction = (key: string) => Promise<Announcement>;

export type AnnouncementClickFunction = (key: string) => void;

export type SettingsClickFunction = () => void;
