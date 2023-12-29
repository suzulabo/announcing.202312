import { AnnouncingJSON, AnnouncingPostsJSON } from './validators.mjs';

import type { ValidateFunction } from 'ajv';

const makeValidator = <T extends ValidateFunction>(f: T) => {
  return (d: unknown) => {
    const valid = f(d);
    if (valid) {
      return { ok: true } as const;
    } else {
      return {
        ok: false,
        errors: { ...f.errors },
      } as const;
    }
  };
};

export const validateAnnouncingJSON = makeValidator(
  AnnouncingJSON as ValidateFunction
);
export const validateAnnouncingPostsJSON = makeValidator(
  AnnouncingPostsJSON as ValidateFunction
);
