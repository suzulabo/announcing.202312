import { BUCKET_PREFIX } from '$env/static/private';
import { createDB } from '@announcing/db';
import { createDB as createNotificationDB } from '@announcing/notification';

export const db = createDB(BUCKET_PREFIX);
export const notificationDB = createNotificationDB();
