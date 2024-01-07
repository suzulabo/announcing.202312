import type { ValidateFunction } from 'ajv';

import type { AnnouncingJSON } from '../types/AnnouncingJSON/AnnouncingJSON';
import makeValidator from './makeValidator';
import { validateAnnouncingJSON as validate } from './validators.mjs';

const validateAnnouncingJSON = makeValidator(validate as ValidateFunction<AnnouncingJSON>);

export default validateAnnouncingJSON;
