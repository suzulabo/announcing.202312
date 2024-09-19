let env = {
  imagePrefix: '',
};

export const setDBEnv = (newEnv: typeof env) => {
  env = newEnv;
};

export const getEnv = () => {
  return env;
};
