import type { BaseMessage } from 'firebase-admin/messaging'
import type { processMessageTask } from './processMessageTask'
import { configure, tasks } from '@trigger.dev/sdk/v3'

export interface TriggerProcessMessageParams {
  tag: string
  message: BaseMessage
}

export async function triggerProcessMessage(params: TriggerProcessMessageParams) {
  await tasks.trigger<typeof processMessageTask>('process-message', params)
}

export function createTriggerClient(accessToken: string) {
  configure({
    accessToken,
  })

  return {
    triggerProcessMessage,
  }
}
