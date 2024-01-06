import type { ValidateFunction } from 'ajv';

import type { AnnouncingJSON } from './AnnouncingJSON/AnnouncingJSON';
import type { AnnouncingPostsJSON } from './AnnouncingJSON/AnnouncingPostsJSON';
import {
  AnnouncingJSON as AnnouncingJSONValidator,
  AnnouncingPostsJSON as AnnouncingPostsJSONValidator,
} from './validators.mjs';

const makeValidator = <T>(f: ValidateFunction<T>) => {
  return (d: unknown): d is T => {
    return f(d);
  };
};

export const validateAnnouncingJSON = makeValidator(
  AnnouncingJSONValidator as ValidateFunction<AnnouncingJSON>,
);
export const validateAnnouncingPostsJSON = makeValidator(
  AnnouncingPostsJSONValidator as ValidateFunction<AnnouncingPostsJSON>,
);
