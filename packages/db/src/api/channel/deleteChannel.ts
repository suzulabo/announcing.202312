import { and, eq, exists } from 'drizzle-orm';

import { db } from '../../client';
import { channelsTable, ownersTable } from '../../schema';

export const deleteChannel = async ({
  userID,
  channelID,
  updatedAt,
}: {
  userID: string;
  channelID: string;
  updatedAt: number;
}) => {
  const result = await db.delete(channelsTable).where(
    and(
      eq(channelsTable.channelID, channelID),
      eq(channelsTable.updatedAt, updatedAt),
      exists(
        db
          .select()
          .from(ownersTable)
          .where(and(eq(ownersTable.channelID, channelID), eq(ownersTable.userID, userID))),
      ),
    ),
  );

  return result.rowsAffected;
};
