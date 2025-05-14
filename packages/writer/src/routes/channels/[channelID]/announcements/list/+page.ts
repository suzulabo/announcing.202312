import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
  const { channelID } = params;
  const parentData = await parent();
  const channel = parentData.channel;

  return {
    channel,
    headerBack: {
      href: `/channels/${channelID}`,
      labelKey: 'back',
    },
  };
};
