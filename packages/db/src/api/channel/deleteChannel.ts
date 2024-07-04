import { and, eq, sql } from 'drizzle-orm';

import { db } from '../../client';
import { channelsTable } from '../../schema';

export const deleteChannel = async (userID: string, channelID: string, updatedAt: Date) => {
  const result = await db
    .delete(channelsTable)
    .where(
      and(
        eq(channelsTable.channelID, channelID),
        eq(channelsTable.updatedAt, updatedAt),
        sql`EXISTS(SELECT 1 FROM json_each(owners) WHERE value = ${userID})`,
      ),
    );

  return result.rowsAffected;
};
