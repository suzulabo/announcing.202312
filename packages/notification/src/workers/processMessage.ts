import type { WorkflowEvent, WorkflowStep } from 'cloudflare:workers';
import { WorkflowEntrypoint } from 'cloudflare:workers';
import { createDB } from '../db/db';
import type { ProcessMessageParams, SendMessageWorkflow } from './types';

export class ProcessMessageWorkflowEntrypoint extends WorkflowEntrypoint<
  { D1_NOTIFICATION: D1Database; WF_SEND_MESSAGE: SendMessageWorkflow },
  ProcessMessageParams
> {
  override async run(event: WorkflowEvent<ProcessMessageParams>, step: WorkflowStep) {
    const db = createDB(this.env);

    const { tag, message } = event.payload;

    await step.do('Dispatch message', async () => {
      await db.readTokens({
        tag,
        callback: async (tokens) => {
          await this.env.WF_SEND_MESSAGE.create({ params: { tokens, message } });
        },
      });
    });
  }
}
