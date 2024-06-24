import { _writeAnnouncement } from './_writeAnnouncement';

export const addAnnouncement = async (
  userID: string,
  channelID: string,
  channelUpdatedAt: number,
  headerImageFile: File | undefined | null,
  title: string | undefined | null,
  body: string,
  imagesFiles: File[] | undefined | null,
) => {
  return _writeAnnouncement(
    userID,
    channelID,
    channelUpdatedAt,
    headerImageFile,
    title,
    body,
    imagesFiles,
    undefined,
  );
};
