export { ProcessMessageWorkflowEntrypoint } from './processMessage';
export { SendMessageWorkflowEntrypoint } from './sendMessage';

export default {
  fetch() {
    return Response.json({}, { status: 404 });
  },
};
