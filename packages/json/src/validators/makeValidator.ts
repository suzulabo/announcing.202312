import type { ValidateFunction } from 'ajv';

type Errors = ValidateFunction['errors'];

const makeValidator = <T>(f: ValidateFunction<T>) => {
  return (d: unknown, errors?: Errors): d is T => {
    const result = f(d);
    if (errors && f.errors) {
      errors.push(...f.errors);
    }
    return result;
  };
};

export default makeValidator;
