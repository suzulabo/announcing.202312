import type { PageLoad } from './$types';

export const load: PageLoad = ({ data }) => {
  return {
    ...data,
    headerBack: {
      href: `/channels/${data.channel.channelID}`,
      labelKey: 'back',
    },
  };
};
