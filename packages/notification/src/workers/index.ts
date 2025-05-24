export { ProcessMessageWorkflowEntrypoint } from './processMessage';
export { ProcessMessageWorkflowRunEntrypoint } from './processMessageRun';
export { PutTokenEntrypoint } from './putToken';
export { SendMessageWorkflowEntrypoint } from './sendMessage';

export default {
  fetch() {
    return Response.json({}, { status: 404 });
  },
};
