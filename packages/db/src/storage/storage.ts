type GetResult = { contentType: string, data: Uint8Array } | undefined

export interface Storage {
  get: (key: string) => Promise<GetResult>
  put: (blob: Blob) => Promise<string>
}

let storage: Storage | undefined

export function setStorage(v: Storage) {
  storage = v
}

function getStorage() {
  if (!storage) {
    throw new Error('storage is not set')
  }

  return storage
}

export function getStorageData(key: string) {
  return getStorage().get(key)
}

export function putStorageData(blob: Blob) {
  return getStorage().put(blob)
}
