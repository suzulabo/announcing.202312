import type { ValidateFunction } from 'ajv';

import type { AnnouncingPostsJSON } from '../types/AnnouncingJSON/AnnouncingPostsJSON';
import makeValidator from './makeValidator';
import { validateAnnouncingPostsJSON as validate } from './validators.mjs';

const validateAnnouncingPostsJSON = makeValidator(
  validate as ValidateFunction<AnnouncingPostsJSON>,
);

export default validateAnnouncingPostsJSON;
