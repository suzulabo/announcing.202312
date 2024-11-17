import { D1Database, D1DatabaseAPI } from '@miniflare/d1';
import { createSQLiteDB } from '@miniflare/shared';
import crypto from 'node:crypto';
import { DATABASE_ID } from '../env';

const uniqueKey = 'miniflare-D1DatabaseObject';

// https://github.com/cloudflare/workers-sdk/issues/4548#issuecomment-1934930563
// https://github.com/cloudflare/workers-sdk/blob/b4a0e74680440084342477fc9373f9f76ab91c0b/packages/miniflare/src/plugins/shared/index.ts#L195
function durableObjectNamespaceIdFromName(name: string) {
  const key = crypto.createHash('sha256').update(uniqueKey).digest();
  const nameHmac = crypto.createHmac('sha256', key).update(name).digest().subarray(0, 16);
  const hmac = crypto.createHmac('sha256', key).update(nameHmac).digest().subarray(0, 16);
  return Buffer.concat([nameHmac, hmac]).toString('hex');
}

const sqliteFilename = durableObjectNamespaceIdFromName(DATABASE_ID);

export const createLocalDB = async () => {
  const sqliteDb = await createSQLiteDB(
    `../cloudflare/.wrangler/state/v3/d1/${uniqueKey}/${sqliteFilename}.sqlite`,
  );

  const d1 = new D1Database(new D1DatabaseAPI(sqliteDb));

  return d1;
};
