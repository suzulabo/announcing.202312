import { and, eq } from 'drizzle-orm';
import type { DBContext } from '../db';
import { tagsTable } from '../schema';

export const getTokenReader = ({ db }: DBContext, { tag }: { tag: string }) => {
  let sub = 1;

  const read = async () => {
    if (sub === 0) {
      return;
    }

    const tagRec = (
      await db
        .select({ tokens: tagsTable.tokens, tail: tagsTable.tail })
        .from(tagsTable)
        .where(and(eq(tagsTable.tag, tag), eq(tagsTable.sub, sub)))
    ).shift();

    if (!tagRec) {
      sub = 0;
      return;
    }

    if (tagRec.tail) {
      sub = 0;
    } else {
      sub++;
    }

    const result = tagRec.tokens
      .trim()
      .split(' ')
      .filter((v) => !!v.trim());
    if (result.length > 0) {
      return result;
    } else {
      sub = 0;
      return;
    }
  };

  return read;
};
