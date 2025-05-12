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

export type CFBindings = {
  D1: D1Database;
  R2: R2Bucket;
};

export type DBContext = {
  db: DrizzleD1Database;
  r2: R2Bucket;
  bucketPrefix: string;
};

export const createAPI = (makeContext: (b: CFBindings) => DBContext) => {
  return {
    createChannel: (params: Parameters<typeof createChannel>[1], b: CFBindings) => {
      return createChannel(makeContext(b), params);
    },
    updateChannel: (params: Parameters<typeof updateChannel>[1], b: CFBindings) => {
      return updateChannel(makeContext(b), params);
    },
    deleteChannel: (params: Parameters<typeof deleteChannel>[1], b: CFBindings) => {
      return deleteChannel(makeContext(b), params);
    },
    getChannel: (params: Parameters<typeof getChannel>[1], b: CFBindings) => {
      return getChannel(makeContext(b), params);
    },
    getChannels: (params: Parameters<typeof getChannels>[1], b: CFBindings) => {
      return getChannels(makeContext(b), params);
    },
    addAnnouncement: (params: Parameters<typeof addAnnouncement>[1], b: CFBindings) => {
      return addAnnouncement(makeContext(b), params);
    },
    updateAnnouncement: (params: Parameters<typeof updateAnnouncement>[1], b: CFBindings) => {
      return updateAnnouncement(makeContext(b), params);
    },
    removeAnnouncement: (params: Parameters<typeof removeAnnouncement>[1], b: CFBindings) => {
      return removeAnnouncement(makeContext(b), params);
    },
    getAnnouncement: (params: Parameters<typeof getAnnouncement>[1], b: CFBindings) => {
      return getAnnouncement(makeContext(b), params);
    },
    getStorage: (params: Parameters<typeof getStorage>[1], b: CFBindings) => {
      return getStorage(makeContext(b), params);
    },
  };
};

export const createDB = (bucketPrefix: string) => {
  const makeContext = (b: CFBindings): DBContext => {
    return {
      db: drizzle(b.D1),
      r2: b.R2 as R2Bucket,
      bucketPrefix,
    };
  };

  return createAPI(makeContext);
};
