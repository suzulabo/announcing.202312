/// <reference types="@sveltejs/kit" />

import type { D1Database, R2Bucket } from '@cloudflare/workers-types';
import type { AnnouncementPreviewData } from './routes/channels/[channelID]/announcements/[[announcementID]]/preview/+page.svelte';
import type { StorePostLogWorkflow } from './workers/storePostLogWorkflow';

type BackLabelKeys = 'back';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      cf: App.Platform['env'];
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
      };
    }
  }
}

export {};
