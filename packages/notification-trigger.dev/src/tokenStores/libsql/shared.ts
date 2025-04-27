import { type Client, type InStatement } from '@libsql/client';

export type Config = {
  client: Client;
  maxTokens?: number;
  debug?: boolean;
};

export type TagSub = {
  tag: string;
  sub: number;
};

export const parseTagSub = (s: string): TagSub => {
  const [tag, sub] = s.split(':');
  if (!tag || !sub) {
    throw new Error(`TagSub format error: [${s}]`);
  }

  return {
    tag,
    sub: +sub,
  };
};

export const debugClient = (client: Client): Client => {
  const batch: Client['batch'] = async (...args) => {
    const start = performance.now();
    try {
      return await client.batch(...args);
    } finally {
      const end = performance.now();
      console.log(`[PERF] batch ${end - start}ms`);
      console.dir(args, { depth: null });
    }
  };
  const execute: Client['execute'] = async (stmt: InStatement) => {
    const start = performance.now();
    try {
      return await client.execute(stmt);
    } finally {
      const end = performance.now();
      console.log(`[PERF] execute ${end - start}ms`);
      console.dir(stmt, { depth: null });
    }
  };

  return { ...client, batch, execute };
};
