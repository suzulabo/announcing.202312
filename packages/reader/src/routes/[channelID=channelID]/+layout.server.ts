import type { LayoutServerLoad } from './$types'
import { getChannel, READER } from '@announcing/db'
import { error } from '@sveltejs/kit'

export const load: LayoutServerLoad = async ({ params }) => {
  const { channelID } = params

  const channel = await getChannel({ userID: READER, channelID })

  if (!channel) {
    error(404)
  }

  return {
    channel,
    channelID,
    headerNotification: {
      channelID,
      name: channel.name,
      icon: channel.icon,
    },
  }
}
