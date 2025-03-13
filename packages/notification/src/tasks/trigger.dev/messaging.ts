import { Buffer } from 'node:buffer'
import process from 'node:process'
import { cert, initializeApp } from 'firebase-admin/app'
import { getMessaging } from 'firebase-admin/messaging'

const serviceAccount = JSON.parse(
  Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64 ?? '', 'base64').toString('utf8'),
)

const credential = cert(serviceAccount)

const app = initializeApp({ credential })

export const messaging = getMessaging(app)
