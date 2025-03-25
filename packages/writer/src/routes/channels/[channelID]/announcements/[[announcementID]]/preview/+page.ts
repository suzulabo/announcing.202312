import type { HeaderBack } from '../../../../../+layout';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
  return {
    headerBack: {
      href: url.href.replace('/preview', ''),
      labelKey: 'back',
    } satisfies HeaderBack,
  };
};
