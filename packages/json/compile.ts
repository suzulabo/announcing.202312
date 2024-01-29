/*
see:
https://ajv.js.org/standalone.html
*/

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import standaloneCode from 'ajv/dist/standalone';
import { writeFileSync } from 'fs';

import announcingJSONSchema from './schemas/AnnouncingJSON/announcingJSONSchema';
import announcingPostsJSONSchema from './schemas/AnnouncingJSON/announcingPostsJSONSchema';

const ajv = new Ajv({
  schemas: [announcingJSONSchema, announcingPostsJSONSchema],
  code: { source: true, esm: true, optimize: true, lines: true },
});
addFormats(ajv);

const code = standaloneCode(ajv, {
  validateAnnouncingJSON: announcingJSONSchema.$id,
  validateAnnouncingPostsJSON: announcingPostsJSONSchema.$id,
});

writeFileSync('src/validators/validators.mjs', code);
