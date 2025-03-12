import type { HeaderBack } from '../../../../+layout.svelte'
import type { PageLoad } from './$types'

export const load: PageLoad = ({ data }) => {
  const backHref = data.announcementID
    ? `/channels/${data.channelID}/announcements/list/${data.announcementID}`
    : `/channels/${data.channelID}`

  return {
    ...data,
    headerBack: {
      href: backHref,
      labelKey: 'back',
    } satisfies HeaderBack,
  }
}
