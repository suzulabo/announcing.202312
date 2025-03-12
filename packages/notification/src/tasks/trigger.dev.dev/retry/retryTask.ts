import { task } from '@trigger.dev/sdk/v3'

export const duplicateChildTask = task({
  id: 'retry',
  maxDuration: 10,
  retry: {
    maxAttempts: 3,
  },
  run: (_, { ctx }) => {
    // ctx.run.id is always the same for retry runs.
    console.log(ctx)
    throw new Error('Always error')
  },
})
