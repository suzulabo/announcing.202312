import type { Messaging, MulticastMessage } from 'firebase-admin/messaging';
import type { PushTokenStore } from '../tokenStores';

type Config = {
  messaging: Messaging;
  tokenStore: PushTokenStore;
};

export const sendMessage = async (config: Config, message: MulticastMessage) => {
  const res = await config.messaging.sendEachForMulticast(message);

  const invalidTokens: string[] = [];

  res.responses.forEach((v, i) => {
    const code = v.error?.code;
    if (
      code === 'messaging/invalid-registration-token' ||
      code === 'messaging/registration-token-not-registered'
    ) {
      const token = message.tokens[i];
      if (token) {
        invalidTokens.push(token);
      }
    }
  });

  if (invalidTokens.length > 0) {
    await config.tokenStore.removeTokens(invalidTokens);
  }
};
