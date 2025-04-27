import type { createTriggerClient } from './triggerClient';

export { createTriggerClient, type TriggerProcessMessageParams } from './triggerClient';
export type TriggerClient = ReturnType<typeof createTriggerClient>;
