import type { TaskManager, TokenStore } from './types';

import { type BaseMessage } from 'firebase-admin/messaging';

const TOKEN_LIMIT = 500;

type Config = {
  idPrefix: string;
  tokenStore: TokenStore;
  taskManager: TaskManager;
};

export const processMessage = async (
  { idPrefix, tokenStore, taskManager }: Config,
  tag: string,
  message: BaseMessage,
) => {
  const reader = tokenStore.getTokensReader(tag);

  const stack: string[] = [];
  let chunk: string[] | undefined;

  let taskNo = 1;

  while ((chunk = await reader()) !== undefined) {
    stack.push(...chunk);
    while (stack.length >= TOKEN_LIMIT) {
      const tokens = stack.splice(0, TOKEN_LIMIT);
      await taskManager.createSendMessageTask(`${idPrefix}${taskNo}`, {
        ...message,
        tokens,
      });
      taskNo++;
    }
  }

  if (stack.length > 0) {
    await taskManager.createSendMessageTask(`${idPrefix}${taskNo}`, {
      ...message,
      tokens: stack,
    });
  }
};
