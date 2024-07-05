import {
  instance,
  maxLength,
  maxSize,
  mimeType,
  minLength,
  nullable,
  number,
  object,
  pipe,
  string,
} from 'valibot';

import { CHANNEL_DESC_MAX_LENGTH, CHANNEL_TITLE_MAX_LENGTH } from '$lib/constants';

export const formSchema = object({
  title: pipe(string(), minLength(1), maxLength(CHANNEL_TITLE_MAX_LENGTH)),
  desc: nullable(pipe(string(), maxLength(CHANNEL_DESC_MAX_LENGTH))),
  icon: nullable(
    pipe(instance(File), maxSize(1024 * 1024), mimeType(['image/jpeg', 'image/png', 'image/webp'])),
  ),
  updatedAt: nullable(number()),
});
