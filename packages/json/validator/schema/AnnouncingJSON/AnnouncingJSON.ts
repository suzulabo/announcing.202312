import { dateProp } from '../../utils';
import { infoSchema } from './Info';
import { postsRefSchema } from './PostsRef';

import type { AnnouncingJSON } from '../../../src/AnnouncingJSON/AnnouncingJSON';
import type { JSONSchemaType } from 'ajv';

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
