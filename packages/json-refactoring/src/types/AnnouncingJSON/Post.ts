import type { OptionalString } from '../types';

export type Post = {
  published: string;
  title?: OptionalString;
  body?: OptionalString;
  img?: OptionalString;
  imgs?: OptionalString[];
  link?: OptionalString;
};
