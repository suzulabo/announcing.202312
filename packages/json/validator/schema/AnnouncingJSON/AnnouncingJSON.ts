import type { JSONSchemaType } from 'ajv';

import type { AnnouncingJSON } from '../../../src/AnnouncingJSON/AnnouncingJSON';
import { dateProp } from '../../utils';
import { infoSchema } from './Info';
import { postsRefSchema } from './PostsRef';

export const AnnouncingJSONSchema: JSONSchemaType<AnnouncingJSON> = {
  $id: 'AnnouncingJSON',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  required: ['updated', 'info', 'posts'],
  properties: {
    info: infoSchema,
    posts: {
      type: 'array',
      items: postsRefSchema,
    },
    updated: dateProp(),
  },
} as const;
