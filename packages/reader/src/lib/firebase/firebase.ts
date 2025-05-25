import { PUBLIC_FIREBASE_CONFIG_JSON, PUBLIC_FIREBASE_VAPID_KEY } from '$env/static/public';
import { getIOSToken } from '$lib/platform/localStorage';
import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getMessaging, getToken, isSupported, type Messaging } from 'firebase/messaging';

const firebaseConfig: FirebaseOptions = JSON.parse(PUBLIC_FIREBASE_CONFIG_JSON);
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

  const iOSToken = getIOSToken();
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
  const iOSToken = getIOSToken();
  if (iOSToken) {
    return iOSToken;
  }

  return ctx?.getPushToken();
};
