/// <reference types="@sveltejs/kit" />

import type { AnnouncementPreviewData } from './routes/channels/[channelID]/announcements/[[announcementID]]/preview/+page.svelte';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    interface PageState {
      fromPage?: string;
      announcementPreviewData?: AnnouncementPreviewData;
    }
    interface Platform {
      env: {
        DB: D1Database;
        Storage: R2Bucket;
      };
    }
  }
}

export {};
