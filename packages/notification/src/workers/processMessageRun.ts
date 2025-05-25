import { WorkerEntrypoint } from 'cloudflare:workers';
import type { ProcessMessageParams, ProcessMessageWorkflow } from './types';

export class ProcessMessageWorkflowRunEntrypoint extends WorkerEntrypoint<{
  WF_PROCESS_MESSAGE: ProcessMessageWorkflow;
}> {
  async createInstance(params: ProcessMessageParams) {
    const res = await this.env.WF_PROCESS_MESSAGE.create({ params });
    return { id: res.id };
  }
}
