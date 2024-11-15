/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    interface PageState {
      fromPage?: string;
    }
    interface Platform {
      env: {
        DB: D1Database;
      };
    }
  }
}

export {};
