import type { Messaging, MulticastMessage } from 'firebase-admin/messaging'
import type { TokenStore } from './types'

interface Config {
  messaging: Messaging
  tokenStore: TokenStore
}

export async function sendMessage(config: Config, message: MulticastMessage) {
  const res = await config.messaging.sendEachForMulticast(message)

  const invalidTokens: string[] = []

  res.responses.forEach((v, i) => {
    const code = v.error?.code
    if (
      code === 'messaging/invalid-registration-token'
      || code === 'messaging/registration-token-not-registered'
    ) {
      const token = message.tokens[i]
      if (token) {
        invalidTokens.push(token)
      }
    }
  })

  if (invalidTokens.length > 0) {
    await config.tokenStore.deleteTokens(invalidTokens)
  }
}
