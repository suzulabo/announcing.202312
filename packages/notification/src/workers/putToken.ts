import { WorkerEntrypoint } from 'cloudflare:workers';
import { createDB } from '../db/db';
import type { PutTokenParams } from './types';

export class PutTokenEntrypoint extends WorkerEntrypoint<{
  D1_NOTIFICATION: D1Database;
}> {
  async putToken(params: PutTokenParams) {
    const db = createDB(this.env);
    await db.putToken(params);
  }
}
