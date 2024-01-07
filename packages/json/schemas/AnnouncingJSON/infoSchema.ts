import type { JSONSchemaType } from 'ajv';

import type { Info } from '../../src/types/AnnouncingJSON/Info';
import { optionalStringProp, optionalUrlProp, stringProp } from '../utils';
import { DESC_MAX_LENGTH, NAME_MAX_LENGTH } from './constants';

const infoSchema: JSONSchemaType<Info> = {
  type: 'object',
  required: ['name'],
  properties: {
    name: stringProp(NAME_MAX_LENGTH),
    desc: optionalStringProp(DESC_MAX_LENGTH),
    link: optionalUrlProp(),
    icon: optionalUrlProp(),
  },
} as const;

export default infoSchema;
