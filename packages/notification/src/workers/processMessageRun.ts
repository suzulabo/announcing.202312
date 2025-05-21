import { WorkerEntrypoint } from 'cloudflare:workers';
import type { ProcessMessageParams, WorkerEnv } from './types';

export class ProcessMessageWorkflowRunEntrypoint extends WorkerEntrypoint<WorkerEnv> {
  async createInstance(params: ProcessMessageParams) {
    const res = await this.env.WF_PROCESS_MESSAGE.create({ params });
    return { id: res.id };
  }
}
