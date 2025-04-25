/// <reference types="@sveltejs/kit" />

import type { TriggerClient } from '@announcing/notification/tasks/trigger.dev';
import type { R2Bucket } from '@cloudflare/workers-types';
import type { AnnouncementPreviewData } from './routes/channels/[channelID]/announcements/[[announcementID]]/preview/+page.svelte';

type BackLabelKeys = 'back';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      triggerClient: TriggerClient;
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
        bucket: R2Bucket;
      };
    }
  }
}

export {};
