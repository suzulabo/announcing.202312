/// <reference types="@cloudflare/workers-types" />

import type { WorkflowEvent, WorkflowStep } from 'cloudflare:workers';
import { WorkflowEntrypoint } from 'cloudflare:workers';

type StorePostLogParams = {
  announcement: {
    userID: string;
    channelID: string;
    announcementID: string;
    headerImage?: string | null | undefined;
    title?: string | null | undefined;
    body: string;
    images?: string[] | null | undefined;
    createdAt: number;
    updatedAt: number;
  };
  ip: string;
};

export type StorePostLogWorkflow = Workflow<StorePostLogParams>;

type WorkerEnv = {
  R2_POST_LOG: R2Bucket;
  WF_STORE_POST_LOG: StorePostLogWorkflow;
};

export class StorePostLogWorkflowEntrypoint extends WorkflowEntrypoint<WorkerEnv, Params> {
  override async run(_event: WorkflowEvent<Params>, step: WorkflowStep) {
    await step.do('Store post log', () => {
      console.log('Do StorePostLogWorkflow');
      return Promise.resolve('');
    });
  }
}
