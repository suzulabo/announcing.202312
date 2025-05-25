import type { WorkflowEvent, WorkflowStep } from 'cloudflare:workers';
import { WorkflowEntrypoint } from 'cloudflare:workers';
import { cert, initializeApp, type App } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { createDB } from '../db/db';
import type { SendMessageParams } from './types';

let app: App | undefined;

const getFirebaseMessaging = (credentialsBase64: string) => {
  if (!app) {
    const serviceAccount = JSON.parse(Buffer.from(credentialsBase64, 'base64').toString('utf8'));
    const credential = cert(serviceAccount);
    app = initializeApp({ credential });
  }

  return getMessaging(app);
};

export class SendMessageWorkflowEntrypoint extends WorkflowEntrypoint<
  { D1_NOTIFICATION: D1Database; GOOGLE_CREDENTIALS_BASE64: string },
  SendMessageParams
> {
  override async run(event: WorkflowEvent<SendMessageParams>, step: WorkflowStep) {
    const { tokens, message } = event.payload;

    const messaging = getFirebaseMessaging(this.env.GOOGLE_CREDENTIALS_BASE64);

    const invalidTokens = await step.do('Send Messages', async () => {
      const res = await messaging.sendEachForMulticast({ tokens, ...message });
      const invalidTokens: string[] = [];

      res.responses.forEach((v, i) => {
        const code = v.error?.code;
        if (
          code === 'messaging/invalid-registration-token' ||
          code === 'messaging/registration-token-not-registered'
        ) {
          const token = tokens[i];
          if (token) {
            invalidTokens.push(token);
          }
        }
      });

      return invalidTokens;
    });

    if (invalidTokens.length > 0) {
      const db = createDB(this.env);
      await step.do('Remove tokens', async () => {
        await db.deleteTokens({ tokens: invalidTokens });
      });
    }
  }
}
