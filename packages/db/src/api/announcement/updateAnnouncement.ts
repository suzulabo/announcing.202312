import { _writeAnnouncement } from './_writeAnnouncement';

export const updateAnnouncement = (
  userID: string,
  channelID: string,
  channelUpdatedAt: number,
  headerImageFile: Blob | undefined | null,
  title: string | undefined | null,
  body: string,
  imagesFiles: Blob[] | undefined | null,
  updateAnnouncementId: string,
) => {
  return _writeAnnouncement(
    userID,
    channelID,
    channelUpdatedAt,
    headerImageFile,
    title,
    body,
    imagesFiles,
    updateAnnouncementId,
  );
};
