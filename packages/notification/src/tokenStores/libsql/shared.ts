import type { Client } from '@libsql/client'

export interface Config {
  client: Client
  maxTokens?: number
  debug?: boolean
}

export interface TagSub {
  tag: string
  sub: number
}

export function parseTagSub(s: string): TagSub {
  const [tag, sub] = s.split(':')
  if (!tag || !sub) {
    throw new Error(`TagSub format error: [${s}]`)
  }

  return {
    tag,
    sub: +sub,
  }
}

export function debugClient(client: Client): Client {
  const batch: Client['batch'] = async (...args) => {
    const start = performance.now()
    try {
      return await client.batch(...args)
    }
    finally {
      const end = performance.now()
      console.log(`[PERF] batch ${end - start}ms`)
      console.dir(args, { depth: null })
    }
  }
  const execute: Client['execute'] = async (...args) => {
    const start = performance.now()
    try {
      return await client.execute(...args)
    }
    finally {
      const end = performance.now()
      console.log(`[PERF] execute ${end - start}ms`)
      console.dir(args, { depth: null })
    }
  }

  return { ...client, batch, execute }
}
