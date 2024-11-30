import { type Client, type InStatement } from '@libsql/client';

type Config = {
  client: Client;
  maxTokens?: number;
  debug?: boolean;
};

type TagSub = {
  tag: string;
  sub: number;
};

const MAX_TOKENS = 50000;

const SELECT_TOKEN = 'SELECT * FROM tokens WHERE token = :token';
const SELECT_SUB_COUNT = `
SELECT sub, count FROM tags
WHERE tag = :tag ORDER BY sub ASC LIMIT 1
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

const debugClient = (client: Client): Client => {
  const batch: Client['batch'] = async (...args) => {
    const start = performance.now();
    try {
      return await client.batch(...args);
    } finally {
      const end = performance.now();
      console.log(`[PERF] batch ${end - start}ms`, args);
    }
  };
  const execute: Client['execute'] = async (...args) => {
    const start = performance.now();
    try {
      return await client.execute(...args);
    } finally {
      const end = performance.now();
      console.log(`[PERF] execute ${end - start}ms`, args);
    }
  };

  return { ...client, batch, execute };
};

const putToken = async (config: Config, token: string, tags: string[]): Promise<void> => {
  const client = config.debug ? debugClient(config.client) : config.client;
  const maxTokens = config.maxTokens ?? MAX_TOKENS;

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
        sql: SELECT_SUB_COUNT,
        args: { tag },
      };
    });

    const recs = await client.batch(stmts, 'read');

    tagsAdded.forEach((tag, i) => {
      const rec = recs[i]?.rows[0];
      let sub = 1;
      if (rec) {
        const count = rec['count'] as number;
        if (count >= maxTokens) {
          sub = (rec['sub'] as number) + 1;
        }
      }
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

export const createLibSqlTokenStore = (config: Config) => {
  return {
    putToken: (token: string, tags: string[]) => {
      return putToken(config, token, tags);
    },
    config,
  };
};
