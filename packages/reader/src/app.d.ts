/// <reference types="@sveltejs/kit" />

import { TokenStore } from '@announcing/notification/core';

type BackLabelKeys = 'back';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      tokenStore: TokenStore;
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
    // interface Platform {}
  }
}

export {};
