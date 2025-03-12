import type { R2Bucket } from '@cloudflare/workers-types'
import type { Storage } from './storage'
import { getStorageKey } from './getStorageKey'

export function createR2Storage(bucket: R2Bucket): Storage {
  const get = async (key: string) => {
    const res = await bucket.get(key)
    if (!res) {
      return
    }

    return {
      contentType: res.httpMetadata?.contentType ?? '',
      data: new Uint8Array(await res.arrayBuffer()),
    }
  }

  const put = async (blob: Blob) => {
    const [key, ab] = await getStorageKey(blob)

    const res = await bucket.head(key)
    if (res) {
      return key
    }

    await bucket.put(key, ab, {
      httpMetadata: {
        contentType: blob.type,
      },
    })

    return key
  }

  return { get, put }
}
