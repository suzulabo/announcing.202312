import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch('/assets/logo.png');
  const blob = await res.blob();

  return {
    channel: {
      title: 'Aether Dynamics Corporation',
      desc: 'Aether Dynamics Corporation is at the forefront of cutting-edge technology, pioneering advancements in energy solutions and sustainable innovation.\nJoin us as we transform the future with dynamic, visionary science.',
      iconFile: new File([blob], '/assets/logo.png', { type: blob.type }),
    },
  };
};
