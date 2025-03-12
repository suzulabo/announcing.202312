import { task } from '@trigger.dev/sdk/v3'

export const duplicateChildTask = task({
  id: 'duplicate-child',
  maxDuration: 10,
  run: async () => {
    return Promise.resolve({})
  },
})
