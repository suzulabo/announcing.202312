// <docs-tag name="full-workflow-example">
import { WorkflowEntrypoint, type WorkflowEvent, WorkflowStep } from 'cloudflare:workers';

type Env = {
  // Add your bindings here, e.g. Workers KV, D1, Workers AI, etc.
  MY_WORKFLOW: Workflow<Params>;
};

// User-defined params passed to your workflow
type Params = {
  message: string;
};

// <docs-tag name="workflow-entrypoint">
export class MyWorkflow extends WorkflowEntrypoint<Env, Params> {
  override async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    // Can access bindings on `this.env`
    // Can access params on `event.payload`

    console.log('check1', { event });
    await step.do('hello', async () => {
      console.log('hello');
      return Promise.resolve('world');
    });
    console.log('check2');
  }
}
// </docs-tag name="workflow-entrypoint">

// <docs-tag name="workflows-fetch-handler">
export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);

    if (url.pathname.startsWith('/favicon')) {
      return Response.json({}, { status: 404 });
    }

    // Get the status of an existing instance, if provided
    // GET /?instanceId=<id here>
    const id = url.searchParams.get('instanceId');
    if (id) {
      const instance = await env.MY_WORKFLOW.get(id);
      return Response.json({
        status: await instance.status(),
      });
    }

    // Spawn a new instance and return the ID and status
    const instance = await env.MY_WORKFLOW.create({ params: { message: 'Uho' } });
    // You can also set the ID to match an ID in your own system
    // and pass an optional payload to the Workflow
    // let instance = await env.MY_WORKFLOW.create({
    // 	id: 'id-from-your-system',
    // 	params: { payload: 'to send' },
    // });
    return new Response(`http://localhost:8787/?instanceId=${instance.id}\n`);
  },
};
// </docs-tag name="workflows-fetch-handler">
// </docs-tag name="full-workflow-example">
