import { and, eq, exists } from 'drizzle-orm';
import type { DB } from '../db';
import { channelsTable, ownersTable } from '../schema';

export const deleteChannel = async (
  db: DB,
  {
    userID,
    channelID,
    updatedAt,
  }: {
    userID: string;
    channelID: string;
    updatedAt: number;
  },
) => {
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
