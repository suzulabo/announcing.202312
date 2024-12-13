import type { createTriggerClient } from './triggerClient';

export { createTriggerClient } from './triggerClient';
export type TriggerClient = ReturnType<typeof createTriggerClient>;
