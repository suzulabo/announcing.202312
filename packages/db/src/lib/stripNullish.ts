type OptionalWithNullish<T> = {
  [P in keyof T]?: unknown;
};

export const stripNullish = <T extends Record<string, unknown>>(o: OptionalWithNullish<T>): T => {
  const n: OptionalWithNullish<T> = {};

  Object.entries<unknown>(o).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      n[k as keyof T] = v;
    }
  });

  return n as T;
};
