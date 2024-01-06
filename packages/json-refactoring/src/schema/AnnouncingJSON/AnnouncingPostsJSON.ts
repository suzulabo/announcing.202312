import type { JSONSchemaType } from 'ajv';

import type { AnnouncingPostsJSON } from '../../types/AnnouncingJSON/AnnouncingPostsJSON';
import { postSchema } from './Post';

export const AnnouncingPostsJSONSchema: JSONSchemaType<AnnouncingPostsJSON> = {
  $id: 'AnnouncingPostsJSON',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'array',
  items: postSchema,
} as const;
