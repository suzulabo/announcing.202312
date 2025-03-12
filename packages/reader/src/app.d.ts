/// <reference types="@sveltejs/kit" />

import type { TokenStore } from '@announcing/notification/core'

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      tokenStore: TokenStore
    }
    // interface PageData {}
    interface PageState {
      fromPage?: string
    }
    // interface Platform {}
  }
}

export {}
