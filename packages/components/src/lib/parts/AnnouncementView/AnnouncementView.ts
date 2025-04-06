export type Announcement = {
  headerImage?: string | undefined;
  title?: string | undefined;
  body: string;
  images?: string[] | undefined;
  updatedAt: number;
  createdAt: number;
};
