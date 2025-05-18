import type { WorkflowStep, WorkflowStepConfig } from 'cloudflare:workers';
import { drizzle } from 'drizzle-orm/d1';
import { migrate } from 'drizzle-orm/d1/migrator';
import { Miniflare } from 'miniflare';
import { resolve } from 'node:path';
import type { NotificationBindings } from '..';
import type { ProcessMessageWorkflowRunEntrypoint } from '../worker';
import { processMessageRun } from '../workflows/processMessageRun';
import { sendMessageRun } from '../workflows/sendMessageRun';
import type { ProcessMessageParams, SendMessageParams, WorkerEnv } from '../workflows/types';

const LOCAL_DIR = '../db-local';
const MIGRATIONS_DIR = '../notification/migrations';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class EmptyClass {}

class WorkflowStepLocal<T> extends (EmptyClass as unknown as typeof WorkflowStep) {
  override do(name: string, callback: () => Promise<T>): Promise<T>;
  override do(name: string, config: WorkflowStepConfig, callback: () => Promise<T>): Promise<T>;
  override async do(
    _name: string,
    configOrCallback: WorkflowStepConfig | (() => Promise<T>),
    maybeCallback?: () => Promise<T>,
  ): Promise<T> {
    if (maybeCallback) {
      return maybeCallback();
    }
    if (typeof configOrCallback === 'function') {
      return configOrCallback();
    }

    throw new Error('No callback');
  }
}

abstract class WorkflowLocal<T> implements Workflow<T> {
  constructor(protected getEnv: () => WorkerEnv) {}
  public create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _options?: WorkflowInstanceCreateOptions<T> | undefined,
  ): Promise<WorkflowInstance> {
    throw new Error('Method not implemented.');
  }

  public get(): Promise<WorkflowInstance> {
    throw new Error('Method not implemented.');
  }
  public createBatch(): Promise<WorkflowInstance[]> {
    throw new Error('Method not implemented.');
  }
}

class ProcessMessageWorkflowLocal extends WorkflowLocal<ProcessMessageParams> {
  public override async create(
    options?: WorkflowInstanceCreateOptions<ProcessMessageParams>,
  ): Promise<WorkflowInstance> {
    if (options?.params) {
      await processMessageRun(this.getEnv(), options.params, new WorkflowStepLocal());
    }
    return {} as WorkflowInstance;
  }
}

class SendMessageWorkflowLocal extends WorkflowLocal<SendMessageParams> {
  public override async create(
    options?: WorkflowInstanceCreateOptions<SendMessageParams>,
  ): Promise<WorkflowInstance> {
    if (options?.params) {
      await sendMessageRun(this.getEnv(), options.params, new WorkflowStepLocal());
    }
    return {} as WorkflowInstance;
  }
}

export const createLocalBindings = async (
  memory = false,
  googleCredentials = '',
): Promise<NotificationBindings> => {
  const path = memory ? 'memory:' : `file://${resolve(LOCAL_DIR)}`;

  const mf = new Miniflare({
    modules: true,
    script: '',
    d1Databases: ['D1_NOTIFICATION'],
    d1Persist: `${path}/d1-notification`,
  });

  const D1_NOTIFICATION = await mf.getD1Database('D1_NOTIFICATION');

  const db = drizzle(D1_NOTIFICATION);

  await migrate(db, { migrationsFolder: MIGRATIONS_DIR });

  const workerEnv: WorkerEnv = {
    D1_NOTIFICATION,
    WF_PROCESS_MESSAGE: new ProcessMessageWorkflowLocal(() => {
      return workerEnv;
    }),
    WF_SEND_MESSAGE: new SendMessageWorkflowLocal(() => {
      return workerEnv;
    }),
    GOOGLE_CREDENTIALS_BASE64: googleCredentials,
  };

  return {
    WF_PROCESS_MESSAGE_RUN: {
      async createInstance(params: ProcessMessageParams) {
        await workerEnv.WF_PROCESS_MESSAGE.create({ params });
        return { id: 'local' };
      },
    } as ProcessMessageWorkflowRunEntrypoint,
  };
};
