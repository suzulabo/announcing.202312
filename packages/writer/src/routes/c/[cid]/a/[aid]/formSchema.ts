import {
  array,
  instance,
  maxLength,
  maxSize,
  mimeType,
  minLength,
  nullish,
  number,
  object,
  pipe,
  string,
} from 'valibot';

import { POST_BODY_MAX_LENGTH, POST_TITLE_MAX_LENGTH } from '$lib/constants';

export const formSchema = object({
  headerImage: nullish(
    pipe(instance(File), maxSize(1024 * 1024), mimeType(['image/jpeg', 'image/png', 'image/webp'])),
  ),
  title: nullish(pipe(string(), maxLength(POST_TITLE_MAX_LENGTH))),
  body: pipe(string(), minLength(1), maxLength(POST_BODY_MAX_LENGTH)),
  images: nullish(
    pipe(
      array(
        pipe(
          instance(File),
          maxSize(1024 * 1024),
          mimeType(['image/jpeg', 'image/png', 'image/webp']),
        ),
      ),
      maxLength(4),
    ),
  ),
  updatedAt: number(),
});
