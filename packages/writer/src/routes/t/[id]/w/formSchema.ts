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
  string,
} from 'valibot';

const formSchema = object({
  title: string([minLength(1), maxLength(CHANNEL_TITLE_MAX_LENGTH)]),
  desc: nullish(string([maxLength(CHANNEL_DESC_MAX_LENGTH)])),
  icon: nullish(
    instance(File, [maxSize(1024 * 1024), mimeType(['image/jpeg', 'image/png', 'image/webp'])]),
  ),
  updatedAt: nullish(number()),
});

export default formSchema;
