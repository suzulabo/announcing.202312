import { THREAD_DESC_MAX_LENGTH, THREAD_TITLE_MAX_LENGTH } from '$lib/constants';
import { instance, maxLength, minLength, object, string } from 'valibot';

export const create = object({
  icon: instance(File),
  title: string([minLength(1), maxLength(THREAD_TITLE_MAX_LENGTH)]),
  desc: string([maxLength(THREAD_DESC_MAX_LENGTH)]),
});
