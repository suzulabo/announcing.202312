type GetResult = { contentType: string; data: Uint8Array } | undefined;

export type Storage = {
  get: (key: string) => Promise<GetResult>;
  put: (blob: Blob) => Promise<string>;
};

export const getStorageData = (storage: Storage, key: string) => {
  return storage.get(key);
};

export const putStorageData = (storage: Storage, blob: Blob) => {
  return storage.put(blob);
};
