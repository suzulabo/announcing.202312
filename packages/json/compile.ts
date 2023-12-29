import { writeFileSync } from 'fs';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import standaloneCode from 'ajv/dist/standalone';

import { AnnouncingJSONSchema } from './validator/schema/AnnouncingJSON/AnnouncingJSON';
import { AnnouncingPostsJSONSchema } from './validator/schema/AnnouncingJSON/AnnouncingPostsJSON';

const ajv = new Ajv({
  schemas: [AnnouncingJSONSchema, AnnouncingPostsJSONSchema],
  code: { source: true, esm: true, optimize: true, lines: true },
});
addFormats(ajv);

const code = standaloneCode(ajv);

writeFileSync('src/validators.mjs', code);
