import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { dev } from './env';

const loadFileLocal = async (hash: string) => {
  try {
    const [metaBuf, stats] = await Promise.all([
      readFile(`../db-dev/storage/${hash}.meta`),
      stat(`../db-dev/storage/${hash}`),
    ]);

    const meta = JSON.parse(metaBuf.toString()) as Record<string, unknown>;

    const contentType = meta['type'] as string;

    const contentLength = stats.size;

    const content = Readable.toWeb(createReadStream(`../db-dev/storage/${hash}`)) as ReadableStream;

    return { contentType, contentLength, content } as const;
  } catch (err) {
    console.log({ err });

    if (err instanceof Error && 'code' in err && err.code === 'ENOENT') {
      return;
    }

    throw err;
  }
};

const loadFileR2: typeof loadFileLocal = () => {
  throw new Error('Not yet implemented');
};

export const loadFile = dev ? loadFileLocal : loadFileR2;
