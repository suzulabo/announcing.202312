/// <reference types="@sveltejs/kit" />
/// <reference types="@sveltejs/adapter-cloudflare-workers" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
    interface Platform {
      env: {
        DB: D1Database;
      };
    }
  }
}

export {};
