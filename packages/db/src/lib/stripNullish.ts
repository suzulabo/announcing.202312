type OptionalWithNullish<T> = {
  [P in keyof T]?: T[P] | null | undefined;
};

export const stripNullish = <T extends Record<string, unknown>>(o: OptionalWithNullish<T>): T => {
  const n: Partial<T> = {};

  Object.entries(o).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      n[k as keyof T] = v;
    }
  });

  return n as T;
};
