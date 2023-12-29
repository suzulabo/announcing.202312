import type { JSONSchemaType } from 'ajv';

import type { PostsRef } from '../../../src/AnnouncingJSON/PostsRef';
import { numberProp, urlProp } from '../../utils';

export const postsRefSchema: JSONSchemaType<PostsRef> = {
  type: 'object',
  required: ['href', 'count'],
  properties: {
    href: urlProp(),
    count: numberProp(),
  },
} as const;
