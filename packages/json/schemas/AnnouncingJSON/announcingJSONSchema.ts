import type { JSONSchemaType } from 'ajv';

import type { AnnouncingJSON } from '../../src/types/AnnouncingJSON/AnnouncingJSON';
import { dateProp } from '../utils';
import infoSchema from './infoSchema';
import postsRefSchema from './postsRefSchema';

const announcingJSONSchema: JSONSchemaType<AnnouncingJSON> = {
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

export default announcingJSONSchema;
