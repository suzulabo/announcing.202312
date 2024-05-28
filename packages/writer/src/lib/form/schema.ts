import { THREAD_DESC_MAX_LENGTH, THREAD_TITLE_MAX_LENGTH } from '$lib/constants';
import { instance, maxLength, maxSize, minLength, object, optional, string } from 'valibot';

export const create = object({
  icon: optional(instance(File, [maxSize(1024 * 1024)])),
  title: string([minLength(1), maxLength(THREAD_TITLE_MAX_LENGTH)]),
  desc: optional(string([maxLength(THREAD_DESC_MAX_LENGTH)])),
});
