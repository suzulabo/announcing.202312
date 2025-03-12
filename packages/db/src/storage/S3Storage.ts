import type { GetObjectCommandOutput, HeadObjectCommandOutput } from '@aws-sdk/client-s3'
import type { Storage } from './storage'
import process from 'node:process'
import {
  GetObjectCommand,

  HeadObjectCommand,

  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getStorageKey } from './getStorageKey'

export function createS3Storage(): Storage {
  const params = process.env.S3_CLIENT_PARAMS
  const bucket = process.env.S3_BUCKET
  const prefix = process.env.S3_PREFIX ?? ''
  if (!params) {
    throw new Error('S3_CLIENT_PARAMS is not set')
  }
  if (!bucket) {
    throw new Error('S3_BUCKET is not set')
  }

  const client = new S3Client(JSON.parse(params))

  const getObject = async <T extends boolean>(
    key: string,
    head: T,
  ): Promise<(T extends true ? HeadObjectCommandOutput : GetObjectCommandOutput) | undefined> => {
    const cmd = head ? HeadObjectCommand : GetObjectCommand

    try {
      return await client.send(
        new cmd({
          Bucket: bucket,
          Key: `${prefix}/${key}`,
        }),
      )
    }
    catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'NotFound') {
          return Promise.resolve(undefined)
        }
      }
      throw error
    }
  }

  const get = async (key: string) => {
    const res = await getObject(key, false)
    if (!res || !res.Body) {
      return
    }

    console.log({ res })

    return {
      contentType: res.Metadata?.['content-type'] ?? '',
      data: await res.Body.transformToByteArray(),
    }
  }

  const put = async (blob: Blob) => {
    const [key, ab, mimeType] = await getStorageKey(blob)

    {
      const res = await getObject(key, true)
      if (res) {
        return key
      }
    }

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: `${prefix}/${key}`,
        Body: ab,
        Metadata: {
          'content-type': mimeType,
        },
      }),
    )

    return key
  }

  return { get, put }
}
