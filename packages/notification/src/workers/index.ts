export { ProcessMessageWorkflowEntrypoint } from './processMessage';
export { ProcessMessageWorkflowRunEntrypoint } from './processMessageRun';
export { SendMessageWorkflowEntrypoint } from './sendMessage';

export default {
  fetch() {
    return Response.json({}, { status: 404 });
  },
};
