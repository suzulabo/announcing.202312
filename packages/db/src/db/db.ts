import type { D1Database, R2Bucket } from '@cloudflare/workers-types';
import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import { addAnnouncement } from './announcement/addAnnouncement';
import { getAnnouncement } from './announcement/getAnnouncement';
import { removeAnnouncement } from './announcement/removeAnnouncement';
import { updateAnnouncement } from './announcement/updateAnnouncement';
import { createChannel } from './channel/createChannel';
import { deleteChannel } from './channel/deleteChannel';
import { getChannel } from './channel/getChannel';
import { getChannels } from './channel/getChannels';
import { updateChannel } from './channel/updateChannel';
import { getStorage } from './storage/getStorage';

type CFBindings = {
  d1: D1Database;
  r2: R2Bucket;
};
type OptionalCFBindings = CFBindings | undefined;

export type DBContext = {
  db: DrizzleD1Database;
  r2: R2Bucket;
  bucketPrefix: string;
};

export const createDB = async (bucketPrefix: string, useLocal: boolean) => {
  const localBindings = useLocal
    ? await (await import('./localBindings')).createLocalBindings()
    : undefined;

  const makeContext = (b: OptionalCFBindings): DBContext => {
    const bindings = b ?? localBindings ?? ({} as CFBindings);
    return {
      db: drizzle(bindings.d1),
      r2: bindings.r2,
      bucketPrefix,
    };
  };

  return {
    createChannel: (b: OptionalCFBindings, params: Parameters<typeof createChannel>[1]) => {
      return createChannel(makeContext(b), params);
    },
    updateChannel: (b: OptionalCFBindings, params: Parameters<typeof updateChannel>[1]) => {
      return updateChannel(makeContext(b), params);
    },
    deleteChannel: (b: OptionalCFBindings, params: Parameters<typeof deleteChannel>[1]) => {
      return deleteChannel(makeContext(b), params);
    },
    getChannel: (b: OptionalCFBindings, params: Parameters<typeof getChannel>[1]) => {
      return getChannel(makeContext(b), params);
    },
    getChannels: (b: OptionalCFBindings, params: Parameters<typeof getChannels>[1]) => {
      return getChannels(makeContext(b), params);
    },
    addAnnouncement: (b: OptionalCFBindings, params: Parameters<typeof addAnnouncement>[1]) => {
      return addAnnouncement(makeContext(b), params);
    },
    updateAnnouncement: (
      b: OptionalCFBindings,
      params: Parameters<typeof updateAnnouncement>[1],
    ) => {
      return updateAnnouncement(makeContext(b), params);
    },
    removeAnnouncement: (
      b: OptionalCFBindings,
      params: Parameters<typeof removeAnnouncement>[1],
    ) => {
      return removeAnnouncement(makeContext(b), params);
    },
    getAnnouncement: (b: OptionalCFBindings, params: Parameters<typeof getAnnouncement>[1]) => {
      return getAnnouncement(makeContext(b), params);
    },
    getStorage: (b: OptionalCFBindings, params: Parameters<typeof getStorage>[1]) => {
      return getStorage(makeContext(b), params);
    },
  };
};
