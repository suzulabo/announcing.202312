import type { WorkflowStep } from 'cloudflare:workers';
import { createDB } from '../db/db';
import type { ProcessMessageParams, WorkerEnv } from './types';

export const processMessageRun = async (
  env: WorkerEnv,
  params: ProcessMessageParams,
  step: WorkflowStep,
) => {
  const db = createDB();

  const { tag, message } = params;

  await step.do('Dispatch message', async () => {
    await db.readTokens(
      {
        tag,
        callback: async (tokens) => {
          await env.WF_SEND_MESSAGE.create({ params: { tokens, message } });
        },
      },
      env,
    );
  });
};
