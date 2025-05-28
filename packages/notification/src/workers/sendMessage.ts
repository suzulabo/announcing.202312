import type { KVNamespace as KVNamespace_ } from '@cloudflare/workers-types';
import type { WorkflowEvent, WorkflowStep } from 'cloudflare:workers';
import { WorkflowEntrypoint } from 'cloudflare:workers';
import { FCM, FcmOptions } from 'fcm-cloudflare-workers';
import { createDB } from '../db/db';
import type { SendMessageParams } from './types';

export class SendMessageWorkflowEntrypoint extends WorkflowEntrypoint<
  { D1_NOTIFICATION: D1Database; KV_NOTIFICATION: KVNamespace; GOOGLE_CREDENTIALS_BASE64: string },
  SendMessageParams
> {
  override async run(event: WorkflowEvent<SendMessageParams>, step: WorkflowStep) {
    const { tokens, message } = event.payload;

    const fcmOptions = new FcmOptions({
      serviceAccount: JSON.parse(
        Buffer.from(this.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString('utf8'),
      ),
      kvStore: this.env.KV_NOTIFICATION as KVNamespace_,
      kvCacheKey: 'fcm_access_token',
    });

    const fcm = new FCM(fcmOptions);

    const invalidTokens = await step.do('Send Messages', async () => {
      return await fcm.sendToTokens({ ...message }, tokens);
    });

    if (invalidTokens.length > 0) {
      const db = createDB(this.env);
      await step.do('Remove tokens', async () => {
        await db.deleteTokens({ tokens: invalidTokens });
      });
    }
  }
}
