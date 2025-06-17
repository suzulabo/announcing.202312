type Announcement = {
  headerImage?: string | undefined;
  title?: string | undefined;
  body: string;
  images?: string[] | undefined;
  updatedAt: number;
  createdAt: number;
};

export interface AnnouncementViewProps {
  announcement: Announcement;
}
