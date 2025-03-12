import type { Task } from '@trigger.dev/sdk/v3'
import type { BaseMessage, MulticastMessage } from 'firebase-admin/messaging'

import { schemaTask } from '@trigger.dev/sdk/v3'
import * as v from 'valibot'
import { processMessage } from '../../core/processMessage'
import { sendMessageTask } from './sendMessageTask'
import { tokenStore } from './tokenStore'

const schema = v.object({
  tag: v.pipe(v.string(), v.nonEmpty(), v.maxBytes(10)),
  message: v.custom<BaseMessage>(() => true),
})

async function createSendMessageTask(id: string, message: MulticastMessage) {
  await sendMessageTask.trigger(
    { message },
    {
      idempotencyKey: id,
    },
  )
}

const schemaParser = v.parser(schema)

export const processMessageTask: Task<'process-message', v.InferInput<typeof schema>> = schemaTask({
  id: 'process-message',
  schema: schemaParser,
  maxDuration: 30,
  retry: {
    maxAttempts: 5,
    minTimeoutInMs: 60000,
    factor: 2,
    randomize: true,
  },
  run: async (payload, { ctx }) => {
    const idPrefix = ctx.run.id

    await processMessage(
      {
        idPrefix,
        tokenStore,
        taskManager: {
          createSendMessageTask,
        },
      },
      payload.tag,
      payload.message,
    )

    return {}
  },
})
