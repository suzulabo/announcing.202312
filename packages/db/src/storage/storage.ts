type GetResult = { contentType: string; data: ArrayBuffer } | undefined;

export type Storage = {
  get: (key: string) => Promise<GetResult>;
  put: (blob: Blob) => Promise<string>;
};

let storage: Storage | undefined = undefined;

export const setStorage = (v: Storage) => {
  storage = v;
};

const getStorage = () => {
  if (!storage) {
    throw new Error('storage is not set');
  }

  return storage;
};

export const getStorageData = (key: string) => {
  return getStorage().get(key);
};

export const putStorageData = (blob: Blob) => {
  return getStorage().put(blob);
};
