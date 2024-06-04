import { POST_BODY_MAX_LENGTH, POST_TITLE_MAX_LENGTH } from '$lib/constants';
import {
  array,
  instance,
  maxLength,
  maxSize,
  mimeType,
  nullish,
  number,
  object,
  string,
} from 'valibot';

const formSchema = object({
  title: nullish(string([maxLength(POST_TITLE_MAX_LENGTH)])),
  body: nullish(string([maxLength(POST_BODY_MAX_LENGTH)])),
  mainImage: nullish(
    instance(File, [maxSize(1024 * 1024), mimeType(['image/jpeg', 'image/png', 'image/webp'])]),
  ),
  images: nullish(
    array(
      instance(File, [maxSize(1024 * 1024), mimeType(['image/jpeg', 'image/png', 'image/webp'])]),
      [maxLength(4)],
    ),
  ),
  updatedAt: nullish(number()),
});

export default formSchema;
