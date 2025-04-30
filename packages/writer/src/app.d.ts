/// <reference types="@sveltejs/kit" />

import type { DBBindings } from '@announcing/db';
import type { NotificationBindings } from '@announcing/notification';
import type { AnnouncementPreviewData } from './routes/channels/[channelID]/announcements/[[announcementID]]/preview/+page.svelte';

type BackLabelKeys = 'back';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      cf: DBBindings & NotificationBindings;
    }
    interface PageData {
      headerBack?: { href: string; labelKey: BackLabelKeys };
    }
    interface PageState {
      fromPage?: string;
      announcementPreviewData?: AnnouncementPreviewData;
    }
    interface Platform {
      env: DBBindings & NotificationBindings;
    }
  }
}

export {};
