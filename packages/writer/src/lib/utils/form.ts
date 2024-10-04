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
