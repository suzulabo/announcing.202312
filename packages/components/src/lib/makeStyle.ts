const makeStyle = (variables?: Record<string, string>) => {
  if (!variables) return;

  const style = Object.entries(variables)
    .map(([k, v]) => {
      return `--${k}:${v}`;
    })
    .join(';');

  return style;
};

export default makeStyle;
