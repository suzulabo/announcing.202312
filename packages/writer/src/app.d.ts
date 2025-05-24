/// <reference types="@sveltejs/kit" />

import type { createDB } from '@announcing/db';
import type {
  ProcessMessageParams,
  ProcessMessageWorkflowRunEntrypoint,
} from '@announcing/notification';
import type { AnnouncementPreviewData } from './routes/channels/[channelID]/announcements/[[announcementID]]/preview/+page.svelte';
import type { StorePostLogParams, StorePostLogWorkflow } from './workers/storePostLogWorkflow';

type BackLabelKeys = 'back';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      db: ReturnType<typeof createDB>;
      storePostLog: (params: StorePostLogParams) => Promise<void>;
      processMessage: (params: ProcessMessageParams) => Promise<void>;
    }
    interface PageData {
      headerBack?: { href: string; labelKey: BackLabelKeys };
    }
    interface PageState {
      fromPage?: string;
      announcementPreviewData?: AnnouncementPreviewData;
    }
    interface Platform {
      env: {
        D1: D1Database;
        R2: R2Bucket;
        WF_STORE_POST_LOG: StorePostLogWorkflow;
        // TODO: rename
        WF_PROCESS_MESSAGE_RUN: ProcessMessageWorkflowRunEntrypoint;
      };
    }
  }
}

export {};
