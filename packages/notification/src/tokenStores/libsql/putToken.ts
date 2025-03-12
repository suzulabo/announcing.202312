import type { InStatement } from '@libsql/client'
import type { Config, TagSub } from './shared'
import { debugClient, parseTagSub } from './shared'

const MAX_TOKENS = 50000

const SELECT_TOKEN = 'SELECT * FROM tokens WHERE token = :token'
const SELECT_SUB_COUNT = `
SELECT sub, count, tail FROM tags
WHERE tag = :tag ORDER BY sub DESC LIMIT 1
`
const UPSERT_TAG = `
INSERT INTO tags(tag, sub, tokens, count, tail)
VALUES(:tag, :sub, :token || ' ', 1, 1)
ON CONFLICT(tag, sub) DO UPDATE SET
tokens = tokens || :token  || ' ', count = count + 1
`
const UPDATE_NOT_TAIL = `
UPDATE tags SET tail = 0 WHERE tag = :tag AND sub = :sub
`
const REMOVE_TAGS_TOKEN = `
UPDATE tags SET
tokens = REPLACE(tokens, :token || ' ', ''), count = count - 1
WHERE tag = :tag AND sub = :sub AND INSTR(tokens, :token) >= 0
`
const UPSERT_TOKEN = `
REPLACE INTO tokens(token, tags)
VALUES(:token, :tags)
`
const DELETE_TOKEN = `
DELETE FROM tokens WHERE token = :token
`

export async function putToken(config: Config, token: string, tags: string[]): Promise<void> {
  const client = config.debug ? debugClient(config.client) : config.client
  const maxTokens = config.maxTokens ?? MAX_TOKENS

  const curTokenRow = (
    await client.execute({
      sql: SELECT_TOKEN,
      args: { token },
    })
  ).rows.shift()

  const curTagsColumn = curTokenRow?.tags as string | undefined

  const curTagSubs: TagSub[] = curTagsColumn
    ? curTagsColumn.trim().split(' ').map(parseTagSub)
    : []
  const tagsAdded: string[] = []
  const tagSubsRemoved: TagSub[] = []

  const newTagSubs: TagSub[] = []

  if (!curTokenRow) {
    tagsAdded.push(...tags)
  }
  else {
    tagsAdded.push(
      ...tags.filter((tag) => {
        return !curTagSubs.some((v) => {
          return v.tag === tag
        })
      }),
    )

    for (const v of curTagSubs) {
      if (tags.includes(v.tag)) {
        newTagSubs.push(v)
      }
      else {
        tagSubsRemoved.push(v)
      }
    }
  }

  const putStatements = [] as InStatement[]

  if (tagsAdded.length > 0) {
    const stmts = tagsAdded.map((tag) => {
      return {
        sql: SELECT_SUB_COUNT,
        args: { tag },
      }
    })

    const recs = await client.batch(stmts, 'read')

    tagsAdded.forEach((tag, i) => {
      const rec = recs[i]?.rows[0]
      let sub = 1
      if (rec) {
        const count = rec.count as number
        if (count >= maxTokens) {
          sub = (rec.sub as number) + 1
          putStatements.push({
            sql: UPDATE_NOT_TAIL,
            args: { tag, sub: sub - 1 },
          })
        }
        else {
          sub = rec.sub as number
        }
      }
      putStatements.push({
        sql: UPSERT_TAG,
        args: { tag, sub, token },
      })
      newTagSubs.push({
        tag,
        sub,
      })
    })
  }

  for (const v of tagSubsRemoved) {
    putStatements.push({
      sql: REMOVE_TAGS_TOKEN,
      args: {
        ...v,
        token,
      },
    })
  }

  if (newTagSubs.length === 0) {
    putStatements.push({
      sql: DELETE_TOKEN,
      args: { token },
    })
  }
  else {
    putStatements.push({
      sql: UPSERT_TOKEN,
      args: {
        token,
        tags: newTagSubs.map(v => `${v.tag}:${v.sub}`).join(' '),
      },
    })
  }

  await client.batch(putStatements, 'write')
}
