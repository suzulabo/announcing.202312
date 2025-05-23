import type { PluginOption } from 'vite';

export const virtualCloudflareWorkers: PluginOption = {
  name: 'virtual-cloudflare-workers',
  enforce: 'pre',
  resolveId(id) {
    if (id === 'cloudflare:workers') {
      return '\0cloudflare:workers';
    }
    return;
  },
  load(id) {
    if (id === '\0cloudflare:workers') {
      return [
        `export class WorkflowEntrypoint {
          constructor(_, env) {this.env = env}
        }`,
        'export class WorkflowStep {}',
      ].join('\n');
    }
    return;
  },
};
