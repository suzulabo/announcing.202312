import type { JSONSchemaType } from 'ajv';

import type { PostsRef } from '../../types/AnnouncingJSON/PostsRef';
import { numberProp, urlProp } from '../utils';

const postsRefSchema: JSONSchemaType<PostsRef> = {
  type: 'object',
  required: ['href', 'count'],
  properties: {
    href: urlProp(),
    count: numberProp(),
  },
} as const;

export default postsRefSchema;
