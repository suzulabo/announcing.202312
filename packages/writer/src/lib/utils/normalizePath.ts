export const normalizePath = (s: string) => {
  if (s.startsWith('idb://')) {
    return s;
  } else {
    return `/s/${s}`;
  }
};
