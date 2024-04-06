import { THREAD_DESC_MAX_LENGTH, THREAD_TITLE_MAX_LENGTH } from '$lib/constants';
import { maxLength, minLength, object, string } from 'valibot';

export const create = object({
  title: string([minLength(1), maxLength(THREAD_TITLE_MAX_LENGTH)]),
  desc: string([maxLength(THREAD_DESC_MAX_LENGTH)]),
});
