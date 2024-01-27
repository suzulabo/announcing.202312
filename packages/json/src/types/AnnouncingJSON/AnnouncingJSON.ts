import type { Info } from './Info';
import type { Post } from './Post';

export type AnnouncingJSON = {
  updated: string;
  info: Info;
  posts: Post[];
};
