export type Channel = {
  title: string;
  desc: string | null;
  icon: string | null;
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

export type AnnouncementKey = string;

export type AnnouncementLoaderFunction = (key: AnnouncementKey) => Promise<Announcement>;

export type SettingsClickFunction = () => void;
