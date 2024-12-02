import type { TaskManager } from '../tasks';
import type { PushTokenStore } from '../tokenStores';

import { type BaseMessage } from 'firebase-admin/messaging';

const TOKEN_LIMIT = 500;

type Config = {
  tokenStore: PushTokenStore;
  taskManager: TaskManager;
};

export const processMessage = async (config: Config, tag: string, message: BaseMessage) => {
  const reader = config.tokenStore.getTokensReader(tag);

  const stack: string[] = [];
  let chunk: string[] | undefined;

  const idBase = `${new Date().getTime()}-${tag}-`;
  let taskNo = 1;

  while ((chunk = await reader()) !== undefined) {
    stack.push(...chunk);
    while (stack.length >= TOKEN_LIMIT) {
      const tokens = stack.splice(0, TOKEN_LIMIT);
      await config.taskManager.createSendMessageTask(idBase + taskNo, { ...message, tokens });
      taskNo++;
    }
  }

  if (stack.length > 0) {
    await config.taskManager.createSendMessageTask(idBase + taskNo, { ...message, tokens: stack });
  }
};
