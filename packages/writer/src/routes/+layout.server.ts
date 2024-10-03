import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  const userID = (await locals.auth())?.user?.id;

  return {
    userID,
  };
};
