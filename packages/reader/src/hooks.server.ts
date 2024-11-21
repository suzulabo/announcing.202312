import { env } from '$env/dynamic/private';
import { CF } from '$env/static/private';
import { setStorage } from '@announcing/db';
import { type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

process.env['DB_URL'] = env.DB_URL;
process.env['DB_AUTH_TOKEN'] = env.DB_AUTH_TOKEN;

if (!CF) {
  const createLocalStorage = (await import('@announcing/db/LocalStorage')).createLocalStorage;
  setStorage(createLocalStorage());
}

const localDBHandle: Handle = ({ resolve, event }) => {
  return resolve(event);
};

export const handle = sequence(localDBHandle);
