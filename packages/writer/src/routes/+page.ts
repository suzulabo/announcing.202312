import { fetchChannels } from '$lib/fetch/fetchChannels';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const channels = await fetchChannels(fetch);
  return { channels };
};
