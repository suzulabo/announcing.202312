import type { MulticastMessage } from 'firebase-admin/messaging'

export interface TokenStore {
  putToken: (token: string, tags: string[]) => Promise<void>
  getTokensReader: (tag: string) => () => Promise<string[] | undefined>
  deleteTokens: (tokens: string[]) => Promise<void>
}

export interface TaskManager {
  createSendMessageTask: (id: string, message: MulticastMessage) => Promise<void>
}
