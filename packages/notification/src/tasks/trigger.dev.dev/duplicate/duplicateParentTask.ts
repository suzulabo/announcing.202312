import { task } from '@trigger.dev/sdk/v3'
import { duplicateChildTask } from './duplicateChildTask'

export const duplicateParentTask = task({
  id: 'duplicate-parent',
  maxDuration: 10,
  run: async () => {
    // There is no error when idempotencyKey is duplicated, it is just skipped.
    await duplicateChildTask.trigger(undefined, { idempotencyKey: 'duplicate' })

    return {}
  },
})
