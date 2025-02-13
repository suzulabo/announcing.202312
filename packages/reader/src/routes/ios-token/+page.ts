import { browser } from '$app/environment';
import { getIOSPwaUUID } from '$lib/platform/platform';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
  if (!browser) {
    return { ok: false };
  }

  const uuid = url.searchParams.get('uuid');
  const token = url.searchParams.get('token');

  if (!uuid || !token) {
    return { ok: false };
  }

  if (uuid !== getIOSPwaUUID()) {
    return { ok: false };
  }

  localStorage.setItem('ios-token', token);

  return { ok: true };
};
