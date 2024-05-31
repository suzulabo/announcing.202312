import { createReadableStream } from '@sveltejs/kit/node';
import { readFile, stat } from 'fs/promises';

const loadFile = async (hash: string) => {
  try {
    const [metaBuf, stats] = await Promise.all([
      readFile(`storage/${hash}.meta`),
      stat(`storage/${hash}`),
    ]);

    const meta = JSON.parse(metaBuf.toString());

    const contentType = meta['type'] as string;

    const contentLength = stats.size;

    const content = createReadableStream(`storage/${hash}`);

    return { contentType, contentLength, content } as const;
  } catch (err) {
    if (err instanceof Error && 'code' in err && err.code === 'ENOENT') {
      return;
    }

    throw err;
  }
};

export default loadFile;
