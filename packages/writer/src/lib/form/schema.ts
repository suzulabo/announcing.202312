import { DESC_MAX_LENGTH, NAME_MAX_LENGTH } from '$lib/constants';
import { maxLength, minLength, object, string } from 'valibot';

export const create = object({
  title: string([minLength(1), maxLength(NAME_MAX_LENGTH)]),
  desc: string([maxLength(DESC_MAX_LENGTH)]),
});
