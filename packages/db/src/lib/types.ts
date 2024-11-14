import type { getAnnouncement } from '../api/announcement/getAnnouncement';
import type { getChannel } from '../api/channel/getChannel';

export type GetChannelResult = Exclude<Awaited<ReturnType<typeof getChannel>>, undefined>;
export type GetAnnouncementResult = Exclude<Awaited<ReturnType<typeof getAnnouncement>>, undefined>;
