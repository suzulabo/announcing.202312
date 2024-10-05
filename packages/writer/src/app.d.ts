/// <reference types="@sveltejs/kit" />

import type { GetAnnouncementResult } from '@announcing/db/types';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    interface PageState {
      fromPage?: string;
      announcementPreviewData?: GetAnnouncementResult;
    }
  }
}

export {};
