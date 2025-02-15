import {
  PUBLIC_FIREBASE_API_KEY,
  PUBLIC_FIREBASE_APP_ID,
  PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  PUBLIC_FIREBASE_PROJECT_ID,
  PUBLIC_FIREBASE_VAPID_KEY,
} from '$env/static/public';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported, type Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: PUBLIC_FIREBASE_API_KEY,
  projectId: PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: PUBLIC_FIREBASE_APP_ID,
};

const vapidKey = PUBLIC_FIREBASE_VAPID_KEY;

const initContext = async () => {
  const supported = await isSupported();

  let messaging: Messaging | undefined;

  if (supported) {
    const app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
  }

  const getPushToken = async () => {
    if (!messaging) {
      return;
    }
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

  const iOSToken = localStorage.getItem('ios-token');
  return { supported: !!iOSToken || supported, getPushToken };
};

let ctx: Awaited<ReturnType<typeof initContext>> | undefined;

export const initFirebase = async () => {
  ctx = await initContext();
};

export const isNotificationSupported = () => {
  return !!ctx?.supported;
};

export const getPushToken = () => {
  const iOSToken = localStorage.getItem('ios-token');
  if (iOSToken) {
    return iOSToken;
  }

  return ctx?.getPushToken();
};
