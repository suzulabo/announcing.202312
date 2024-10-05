export const getFormString = (form: FormData, name: string) => {
  const v = form.get(name);
  if (typeof v === 'string') {
    return v;
  }
  return;
};

export const getFormNumber = (form: FormData, name: string) => {
  const v = form.get(name);
  if (typeof v === 'string') {
    return +v;
  }
  return;
};

export const getFormFile = (form: FormData, name: string) => {
  const v = form.get(name);
  if (v instanceof File) {
    return v;
  }
  return;
};

export const getFormFileOrRemove = (form: FormData, name: string) => {
  const v = form.get(name);
  if (v === 'remove') {
    return v;
  }
  if (v instanceof File) {
    return v;
  }
  return;
};

export const getFormFiles = (form: FormData, name: string) => {
  const l = form.getAll(name);
  const result: File[] = [];
  for (const v of l) {
    if (v instanceof File) {
      result.push(v);
    } else {
      return;
    }
  }
  return result;
};
