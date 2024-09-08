export const toClass = (m: Record<string, boolean> | undefined) => {
  if (!m) {
    return;
  }

  const result = [];

  for (const [k, v] of Object.entries(m)) {
    if (v) {
      result.push(k);
    }
  }

  return result.join(' ');
};
