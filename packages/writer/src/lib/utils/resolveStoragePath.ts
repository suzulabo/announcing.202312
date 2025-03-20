export const resolveStoragePath = (s: string) => {
  if (!s.includes('/')) {
    return `/s/${s}`;
  }
  return s;
};
