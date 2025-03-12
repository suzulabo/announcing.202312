import { redirect } from '@sveltejs/kit'

export async function getUserID(locals: App.Locals) {
  const userID = (await locals.auth())?.user?.id

  if (!userID)
    redirect(303, '/signin')

  return userID
}

export async function getUserIDNoRedirect(locals: App.Locals) {
  return (await locals.auth())?.user?.id
}
