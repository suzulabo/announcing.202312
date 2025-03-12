import process from 'node:process'
import { toPng } from 'jdenticon'
import { assert, describe, expect } from 'vitest'
import { createS3Storage } from '../src/storage/S3Storage'

const params = process.env.S3_CLIENT_PARAMS
const bucket = process.env.S3_BUCKET

const runIfEnv = params && bucket ? test : test.skip

describe('s3Storage Tests', () => {
  runIfEnv('Put and Get', async () => {
    const storage = createS3Storage()
    const image = toPng(new Date(), 100)
    const blob = new Blob([image], { type: 'image/png' })

    const key = await storage.put(blob)

    const res = await storage.get(key)
    assert(res)
    expect(res.contentType).toEqual('image/png')
    expect(res.data).toEqual(new Uint8Array(image))
  })
})
