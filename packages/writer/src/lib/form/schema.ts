import { THREAD_DESC_MAX_LENGTH, THREAD_TITLE_MAX_LENGTH } from '$lib/constants';
import {
  instance,
  maxLength,
  maxSize,
  mimeType,
  minLength,
  nullish,
  object,
  string,
} from 'valibot';

export const create = object({
  title: string([minLength(1), maxLength(THREAD_TITLE_MAX_LENGTH)]),
  desc: nullish(string([maxLength(THREAD_DESC_MAX_LENGTH)])),
  icon: nullish(
    instance(File, [maxSize(1024 * 1024), mimeType(['image/jpeg', 'image/png', 'image/webp'])]),
  ),
});
