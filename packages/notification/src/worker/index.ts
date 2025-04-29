import { WorkflowEntrypoint, WorkflowStep, type WorkflowEvent } from 'cloudflare:workers';
import { cert, initializeApp } from 'firebase-admin/app';
import { getMessaging, type BaseMessage } from 'firebase-admin/messaging';
import { createDB } from '../db/db';

type Env = {
  D1_NOTIFICATION: D1Database;
  WF_PROCESS_MESSAGE: Workflow<ProcessMessageParams>;
  WF_SEND_MESSAGE: Workflow<SendMessageParams>;
  GOOGLE_CREDENTIALS_BASE64: string;
};

type ProcessMessageParams = {
  tag: string;
  message: BaseMessage;
};

const getFirebaseMessaging = (credentialsBase64: string) => {
  const serviceAccount = JSON.parse(Buffer.from(credentialsBase64, 'base64').toString('utf8'));

  const credential = cert(serviceAccount);

  const app = initializeApp({ credential });

  return getMessaging(app);
};

export class ProcessMessageWorkflow extends WorkflowEntrypoint<Env, ProcessMessageParams> {
  override async run(event: WorkflowEvent<ProcessMessageParams>, step: WorkflowStep) {
    const db = createDB();

    const { tag, message } = event.payload;

    await step.do('Dispatch message', async () => {
      await db.readTokens(
        {
          tag,
          callback: async (tokens) => {
            await this.env.WF_SEND_MESSAGE.create({ params: { tokens, message } });
          },
        },
        this.env,
      );
    });
  }
}

type SendMessageParams = {
  tokens: string[];
  message: BaseMessage;
};

export class SendMessageWorkflow extends WorkflowEntrypoint<Env, SendMessageParams> {
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
      const db = createDB();
      await step.do('Remove tokens', async () => {
        await db.deleteTokens({ tokens: invalidTokens }, this.env);
      });
    }
  }
}

export default {
  fetch() {
    return Response.json({}, { status: 404 });
  },
};
