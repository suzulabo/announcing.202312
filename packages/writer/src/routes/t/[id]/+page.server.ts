import { db } from '$lib/db/client';
import { threadsTable } from '$lib/db/schema';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

const getThread = async (id: number) => {
  if (isNaN(id)) {
    return;
  }

  return (await db.select().from(threadsTable).where(eq(threadsTable.threadID, id))).shift();
};

export const load: PageServerLoad = async ({ params }) => {
  const thread = await getThread(+params.id);

  if (!thread) {
    throw redirect(303, '/');
  }

  return {
    thread,
  };
};
