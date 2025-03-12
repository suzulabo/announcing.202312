import type { Snapshot } from '@sveltejs/kit'
import { getContext, setContext } from 'svelte'

interface Context {
  addSnapshot: (snapshot: Snapshot) => void
}

export function createSnapshotContext(): Snapshot {
  const snapshots: Snapshot[] = []

  setContext<Context>('snapshot', {
    addSnapshot: (snapshot) => {
      snapshots.push(snapshot)
    },
  })

  return {
    capture: () => {
      const result = {}
      for (const s of snapshots) {
        Object.assign(result, s.capture())
      }
      return result
    },
    restore: (snapshot) => {
      for (const s of snapshots) {
        s.restore(snapshot)
      }
    },
  }
}

export function addSnapShot(snapshot: Snapshot) {
  const ctx = getContext<Context | undefined>('snapshot')

  if (ctx) {
    ctx.addSnapshot(snapshot)
  }
}
