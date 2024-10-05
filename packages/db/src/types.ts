import type { getAnnouncement } from './api/announcement/getAnnouncement';

export type GetAnnouncementResult = Exclude<Awaited<ReturnType<typeof getAnnouncement>>, undefined>;
