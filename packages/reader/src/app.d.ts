/// <reference types="@sveltejs/kit" />

import type { DBBindings } from '@announcing/db';
import type { NotificationDBBindings } from '@announcing/notification';

type BackLabelKeys = 'back';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      cf: DBBindings & NotificationDBBindings;
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
      env: DBBindings & NotificationDBBindings;
    }
  }
}

export {};
