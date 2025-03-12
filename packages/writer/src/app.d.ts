/// <reference types="@sveltejs/kit" />

import type { TriggerClient } from '@announcing/notification/tasks/trigger.dev'
import type { AnnouncementPreviewData } from './routes/channels/[channelID]/announcements/[[announcementID]]/preview/+page.svelte'

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      triggerClient: TriggerClient
    }
    // interface PageData {}
    interface PageState {
      fromPage?: string
      announcementPreviewData?: AnnouncementPreviewData
    }
    interface Platform {
      env: {
        DB: D1Database
        Storage: R2Bucket
      }
    }
  }
}

export {}
