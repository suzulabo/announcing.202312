export const URL_MAX_LENGTH = 2000;

export const stringProp = (len: number) => {
  return {
    type: 'string',
    nullable: false,
    minLength: 1,
    maxLength: len,
  } as const;
};

export const optionalStringProp = (len: number) => {
  return {
    type: 'string',
    nullable: true,
    maxLength: len,
  } as const;
};

export const urlProp = () => {
  return {
    type: 'string',
    nullable: false,
    minLength: 1,
    maxLength: URL_MAX_LENGTH,
    format: 'uri-reference',
  } as const;
};

export const optionalUrlProp = () => {
  return {
    type: 'string',
    nullable: true,
    maxLength: URL_MAX_LENGTH,
    format: 'uri-reference',
  } as const;
};

export const dateProp = () => {
  return {
    type: 'string',
    format: 'date-time',
    minLength: 1,
    maxLength: 30,
    nullable: false,
  } as const;
};

export const numberProp = () => {
  return {
    type: 'number',
    nullable: false,
  } as const;
};
