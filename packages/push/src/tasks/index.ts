import type { MulticastMessage } from 'firebase-admin/messaging';

export type TaskManager = {
  createSendMessageTask: (id: string, message: MulticastMessage) => Promise<void>;
};
