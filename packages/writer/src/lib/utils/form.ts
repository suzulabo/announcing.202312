export const getFormString = (form: FormData, name: string) => {
  const s = form.get(name);
  if (typeof s === 'string') {
    return s;
  }
  return;
};

export const getFormFile = (form: FormData, name: string) => {
  const s = form.get(name);
  if (s instanceof File) {
    return s;
  }
  return;
};
