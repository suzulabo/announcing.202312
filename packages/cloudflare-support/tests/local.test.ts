import { expect, it } from 'vitest';
import { WorkflowLocal } from '../src/local';
import type { ExecutionContext, WorkflowEvent, WorkflowStep } from '../src/types';
import { WorkflowEntrypoint } from '../src/types';

it('workflow', async () => {
  let a = 0;

  class TestWorkflowEntrypoint extends WorkflowEntrypoint {
    override async run(event: Readonly<WorkflowEvent<{ n: number }>>, step: WorkflowStep) {
      await step.do('test', () => {
        a = event.payload.n;
        return Promise.resolve();
      });
    }
  }

  const params = { n: 1 };
  const entrypoint = new TestWorkflowEntrypoint({} as ExecutionContext, {});
  const workflow = new WorkflowLocal(entrypoint);
  await workflow.create({ params });
  expect(a).toBe(1);
});
