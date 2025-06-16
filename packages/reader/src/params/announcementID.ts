const regex = /^[0-9A-Za-z]{3}[A-Za-z0-9\-_]{6}$/;

export const match = (param: string) => {
  return param.match(regex) !== null;
};
