import { BUCKET_PREFIX } from '$env/static/private';
import { createDB } from '@announcing/db';

export const db = createDB(BUCKET_PREFIX);
