import {
  WorkerEntrypoint,
  WorkflowEntrypoint,
  WorkflowStep,
  type WorkflowEvent,
} from 'cloudflare:workers';
import { processMessageRun } from '../workflows/processMessageRun';
import { sendMessageRun } from '../workflows/sendMessageRun';
import type { ProcessMessageParams, SendMessageParams, WorkerEnv } from '../workflows/types';

export class ProcessMessageWorkflowEntrypoint extends WorkflowEntrypoint<
  WorkerEnv,
  ProcessMessageParams
> {
  override run(event: WorkflowEvent<ProcessMessageParams>, step: WorkflowStep) {
    return processMessageRun(this.env, event.payload, step);
  }
}

export class SendMessageWorkflowEntrypoint extends WorkflowEntrypoint<
  WorkerEnv,
  SendMessageParams
> {
  override async run(event: WorkflowEvent<SendMessageParams>, step: WorkflowStep) {
    return sendMessageRun(this.env, event.payload, step);
  }
}

export class ProcessMessageWorkflowRunEntrypoint extends WorkerEntrypoint<WorkerEnv> {
  async createInstance(params: ProcessMessageParams) {
    const res = await this.env.WF_PROCESS_MESSAGE.create({ params });
    return { id: res.id };
  }
}

export default {
  fetch() {
    return Response.json({}, { status: 404 });
  },
};
