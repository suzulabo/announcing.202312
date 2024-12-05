import { initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

const app = initializeApp();

export const messaging = getMessaging(app);
