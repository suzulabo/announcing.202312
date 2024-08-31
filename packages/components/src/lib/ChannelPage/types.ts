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

export type AnnouncementLoaderFunction = (key: string) => Promise<Announcement>;

export type AnnouncementClickFunction = (key: string) => void;

export type SettingsClickFunction = () => void;
