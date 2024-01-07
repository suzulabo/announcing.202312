import type { OptionalString } from '../utils';

export type Post = {
  published: string;
  title?: OptionalString;
  body?: OptionalString;
  img?: OptionalString;
  imgs?: OptionalString[];
  link?: OptionalString;
};
