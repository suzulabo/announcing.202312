// See https://kit.svelte.dev/docs/types#app

import type { Announcement } from '$lib/parts/AnnouncementEditor/AnnouncementEditor.svelte';

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    interface PageState {
      announcementViewZoomImage?: {
        src: string;
      };
      announcementEditorPagePreview?: {
        announcement: Announcement;
      };
      fromHref?: string;
    }
    // interface Platform {}
  }
}

export {};
