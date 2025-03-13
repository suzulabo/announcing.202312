import type { Task } from '@trigger.dev/sdk/v3'

import type { Messaging, MulticastMessage } from 'firebase-admin/messaging'
import { Buffer } from 'node:buffer'
import process from 'node:process'
import { schemaTask } from '@trigger.dev/sdk/v3'
import { cert, initializeApp } from 'firebase-admin/app'

import { getMessaging } from 'firebase-admin/messaging'
import * as v from 'valibot'

import { sendMessage } from '../../core/sendMessage'

import { tokenStore } from './tokenStore'

let messaging: Messaging | undefined

function getFirebaseMessaging() {
  if (!messaging) {
    const serviceAccount = JSON.parse(
      Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64 ?? '', 'base64').toString('utf8'),
    )

    const credential = cert(serviceAccount)

    const app = initializeApp({ credential })

    messaging = getMessaging(app)
  }

  return messaging
}

const schema = v.object({
  message: v.custom<MulticastMessage>(() => true),
})
const schemaParser = v.parser(schema)

export const sendMessageTask: Task<'send-message', v.InferInput<typeof schema>> = schemaTask({
  id: 'send-message',
  schema: schemaParser,
  maxDuration: 30,
  retry: {
    maxAttempts: 5,
    minTimeoutInMs: 60000,
    factor: 2,
    randomize: true,
  },
  run: async (payload) => {
    await sendMessage({ messaging: getFirebaseMessaging(), tokenStore }, payload.message)

    return {}
  },
})
