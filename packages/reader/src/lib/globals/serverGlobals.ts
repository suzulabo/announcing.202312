import { env } from '$env/dynamic/private';
import { createTriggerClient } from '@announcing/notification/tasks/trigger.dev';

export const triggerClient = createTriggerClient(env.TRIGGER_SECRET_KEY);
