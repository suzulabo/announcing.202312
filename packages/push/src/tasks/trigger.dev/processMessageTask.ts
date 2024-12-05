import { schemaTask } from '@trigger.dev/sdk/v3';

import { type BaseMessage, type MulticastMessage } from 'firebase-admin/messaging';
import * as v from 'valibot';
import { processMessage } from '../../core/processMessage';
import { sendMessageTask } from './sendMessageTask';
import { tokenStore } from './tokenStore';

const schema = v.parser(
  v.object({
    tag: v.pipe(v.string(), v.nonEmpty(), v.maxBytes(10)),
    message: v.custom<BaseMessage>(() => true),
  }),
);

const createSendMessageTask = async (id: string, message: MulticastMessage) => {
  await sendMessageTask.trigger(
    { message },
    {
      idempotencyKey: id,
    },
  );
};

export const processMessageTask = schemaTask({
  id: 'process-message',
  schema,
  maxDuration: 10,
  run: async (payload, { ctx }) => {
    const idPrefix = ctx.run.id;

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
    );

    return {};
  },
});
