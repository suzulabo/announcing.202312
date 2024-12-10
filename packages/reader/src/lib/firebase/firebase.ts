import { browser } from '$app/environment';
import {
  PUBLIC_FIREBASE_API_KEY,
  PUBLIC_FIREBASE_APP_ID,
  PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  PUBLIC_FIREBASE_PROJECT_ID,
  PUBLIC_FIREBASE_VAPID_KEY,
} from '$env/static/public';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: PUBLIC_FIREBASE_API_KEY,
  projectId: PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: PUBLIC_FIREBASE_APP_ID,
};

const vapidKey = PUBLIC_FIREBASE_VAPID_KEY;

const initContext = () => {
  if (!browser) {
    return;
  }

  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);

  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
  });

  const getPushToken = async () => {
    const serviceWorkerRegistration = await navigator.serviceWorker.getRegistration();
    if (!serviceWorkerRegistration) {
      console.log('no sw');
      return;
    }

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration,
    });

    return token;
  };

  return { getPushToken };
};

let ctx: Awaited<ReturnType<typeof initContext>>;

export const isMessagingSupported = () => {
  return isSupported();
};

export const initFirebase = () => {
  ctx = initContext();
};

export const getPushToken = () => {
  return ctx?.getPushToken();
};
