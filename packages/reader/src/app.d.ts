/// <reference types="@sveltejs/kit" />

import type { createDB } from '@announcing/db';
import type { PutTokenEntrypoint, PutTokenParams } from '@announcing/notification';

type BackLabelKeys = 'back';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      db: ReturnType<typeof createDB>;
      putToken: (params: PutTokenParams) => Promise<void>;
    }
    interface PageData {
      headerBack?: { href: string; labelKey: BackLabelKeys };
      headerNotification?: {
        channelID: string;
        name: string;
        icon?: string;
      };
    }
    interface PageState {
      fromPage?: string;
    }
    interface Platform {
      env: {
        D1: D1Database;
        R2: R2Bucket;
        WK_PUT_TOKEN: PutTokenEntrypoint;
      };
    }
  }
}

export {};
