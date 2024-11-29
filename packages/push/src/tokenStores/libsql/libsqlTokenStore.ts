import { type Client, type InStatement } from '@libsql/client';

type TagSub = {
  tag: string;
  sub: number;
};

const MAX_TOKENS = 50000;

const SELECT_TOKEN = 'SELECT * FROM tokens WHERE token = :token';
const SELECT_SUB = `
SELECT sub FROM tags
WHERE tag = :tag AND count <= ${MAX_TOKENS} ORDER BY sub LIMIT 1
`;
const UPSERT_TAGS = `
INSERT INTO tags(tag, sub, tokens, count)
VALUES(:tag, :sub, :token || ' ', 1)
ON CONFLICT(tag, sub) DO UPDATE SET
tokens = tokens || ' ' || :token , count = count + 1
`;
const REMOVE_TOKEN = `
UPDATE tags SET
tokens = REPLACE(tokens, :token || ' ', ''), count = count - 1
WHERE tag = :tag AND sub = :sub AND INSTR(tokens, :token) >= 0
`;
const UPSERT_TOKENS = `
REPLACE INTO tokens(token, tags)
VALUES(:token, :tags)
`;

const parseTagSub = (s: string): TagSub => {
  const [tag, sub] = s.split(':');
  if (!tag || !sub) {
    throw new Error(`TagSub format error: [${s}]`);
  }

  return {
    tag,
    sub: +sub,
  };
};

const putToken = async (client: Client, token: string, tags: string[]): Promise<void> => {
  const curTokenRow = (
    await client.execute({
      sql: SELECT_TOKEN,
      args: { token },
    })
  ).rows.shift();

  const curTagsColumn = curTokenRow?.['tags'] as string | undefined;

  const curTagSubs: TagSub[] = curTagsColumn
    ? curTagsColumn.trim().split(' ').map(parseTagSub)
    : [];
  const tagsAdded: string[] = [];
  const tagSubsRemoved: TagSub[] = [];

  const newTagSubs: TagSub[] = [];

  if (!curTokenRow) {
    tagsAdded.push(...tags);
  } else {
    tagsAdded.push(
      ...tags.filter((tag) => {
        return !curTagSubs.some((v) => {
          return v.tag === tag;
        });
      }),
    );

    for (const v of curTagSubs) {
      if (tags.includes(v.tag)) {
        newTagSubs.push(v);
      } else {
        tagSubsRemoved.push(v);
      }
    }
  }

  const putStatements = [] as InStatement[];

  if (tagsAdded.length > 0) {
    const stmts = tagsAdded.map((tag) => {
      return {
        sql: SELECT_SUB,
        args: { tag },
      };
    });

    const recs = await client.batch(stmts, 'read');

    tagsAdded.forEach((tag, i) => {
      const sub = (recs[i]?.rows[0]?.['sub'] ?? 1) as number;
      putStatements.push({
        sql: UPSERT_TAGS,
        args: { tag, sub, token },
      });
      newTagSubs.push({
        tag,
        sub,
      });
    });
  }

  for (const v of tagSubsRemoved) {
    putStatements.push({
      sql: REMOVE_TOKEN,
      args: {
        ...v,
        token,
      },
    });
  }

  putStatements.push({
    sql: UPSERT_TOKENS,
    args: {
      token,
      tags: newTagSubs.map((v) => `${v.tag}:${v.sub}`).join(' '),
    },
  });

  await client.batch(putStatements, 'write');
};

export const createLibSqlTokenStore = (client: Client) => {
  return {
    putToken: (token: string, tags: string[]) => {
      return putToken(client, token, tags);
    },
  };
};
