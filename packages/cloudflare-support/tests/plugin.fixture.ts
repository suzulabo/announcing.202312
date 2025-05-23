import { WorkflowEntrypoint } from 'cloudflare:workers';
import { WorkflowLocal, WorkflowStepLocal } from '../src/local';

class TestWorkflowEntryPoint extends WorkflowEntrypoint {}

export const main = () => {
  new WorkflowStepLocal();
  const entrypoint = new TestWorkflowEntryPoint({} as ExecutionContext, {});
  return new WorkflowLocal(entrypoint);
};
