import { redirect } from '@sveltejs/kit';

export const getUserID = async (locals: App.Locals) => {
  const userID = (await locals.auth())?.user?.id;

  if (!userID) throw redirect(303, '/signin');

  return userID;
};
