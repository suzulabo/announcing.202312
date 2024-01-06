import type { Info } from './Info';
import type { PostsRef } from './PostsRef';

export type AnnouncingJSON = {
  updated: string;
  info: Info;
  posts: PostsRef[];
};
