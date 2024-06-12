import { CHANNEL_DESC_MAX_LENGTH, CHANNEL_TITLE_MAX_LENGTH } from '$lib/constants';
import {
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

export const formSchema = object({
  title: pipe(string(), minLength(1), maxLength(CHANNEL_TITLE_MAX_LENGTH)),
  desc: nullish(pipe(string(), maxLength(CHANNEL_DESC_MAX_LENGTH))),
  icon: nullish(
    pipe(instance(File), maxSize(1024 * 1024), mimeType(['image/jpeg', 'image/png', 'image/webp'])),
  ),
  updatedAt: nullish(number()),
});
