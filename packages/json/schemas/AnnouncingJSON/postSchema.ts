import type { JSONSchemaType } from 'ajv';

import type { Post } from '../../src/types/AnnouncingJSON/Post';
import { dateProp, optionalStringProp, optionalUrlProp, urlProp } from '../utils';
import { BODY_MAX_LENGTH, TITLE_MAX_LENGTH } from './constants';

const postSchema: JSONSchemaType<Post> = {
  type: 'object',
  required: ['published'],
  properties: {
    published: dateProp(),
    title: optionalStringProp(TITLE_MAX_LENGTH),
    body: optionalStringProp(BODY_MAX_LENGTH),
    img: optionalUrlProp(),
    imgs: {
      type: 'array',
      nullable: true,
      maxItems: 10,
      uniqueItems: true,
      items: urlProp(),
    },
    link: optionalUrlProp(),
  },
} as const;

export default postSchema;
