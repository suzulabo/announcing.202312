import { schemaTask } from '@trigger.dev/sdk/v3';
import { type MulticastMessage } from 'firebase-admin/messaging';

import * as v from 'valibot';
import { sendMessage } from '../../core/sendMessage';
import { messaging } from './messaging';
import { tokenStore } from './tokenStore';

const schema = v.parser(
  v.object({
    message: v.custom<MulticastMessage>(() => true),
  }),
);

export const sendMessageTask = schemaTask({
  id: 'send-message',
  schema,
  maxDuration: 10,
  run: async (payload) => {
    await sendMessage({ messaging, tokenStore }, payload.message);

    return {};
  },
});
