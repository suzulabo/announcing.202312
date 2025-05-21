/// <reference types="@cloudflare/workers-types" />

import type { WorkflowEvent, WorkflowStep } from 'cloudflare:workers';
import { WorkflowEntrypoint } from 'cloudflare:workers';

export type StorePostLogParams = {
  userID: string;
  channelID: string;
  announcementID: string;
  headerImage?: string | null | undefined;
  title?: string | null | undefined;
  body: string;
  images?: string[] | null | undefined;
  createdAt: number;
  updatedAt: number;
  ip: string;
  prevAnnouncementID?: string;
};

export type StorePostLogWorkflow = Workflow<StorePostLogParams>;

type WorkerEnv = {
  R2_POST_LOG: R2Bucket;
  WF_STORE_POST_LOG: StorePostLogWorkflow;
};

export class StorePostLogWorkflowEntrypoint extends WorkflowEntrypoint<
  WorkerEnv,
  StorePostLogParams
> {
  override async run({ payload }: WorkflowEvent<StorePostLogParams>, step: WorkflowStep) {
    await step.do('Store post log', async () => {
      console.log('Store post log', payload);
      const { channelID, announcementID, updatedAt } = payload;
      const key = `${channelID}-${announcementID}-${updatedAt}.json`;
      await this.env.R2_POST_LOG.put(key, JSON.stringify(payload));
    });
  }
}
