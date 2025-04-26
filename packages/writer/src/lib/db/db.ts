import { building } from '$app/environment';
import { BUCKET_PREFIX } from '$env/static/private';
import { createDB } from '@announcing/db';

export const db = building
  ? createDB(BUCKET_PREFIX)
  : await (await import('@announcing/db/localDB')).createLocalDB();
