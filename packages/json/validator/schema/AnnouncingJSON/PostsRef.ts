import { numberProp, urlProp } from '../../utils';

import type { PostsRef } from '../../../src/AnnouncingJSON/PostsRef';
import type { JSONSchemaType } from 'ajv';

export const postsRefSchema: JSONSchemaType<PostsRef> = {
  type: 'object',
  required: ['href', 'count'],
  properties: {
    href: urlProp(),
    count: numberProp(),
  },
} as const;
