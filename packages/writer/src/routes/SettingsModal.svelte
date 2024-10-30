<script lang="ts" context="module">
  const localeValues = [
    ['en', 'English'],
    ['ja', '日本語'],
  ] satisfies [Locales, string][];
</script>

<script lang="ts">
  import IcBaselineRadioButtonChecked from '$lib/components/icon/IcBaselineRadioButtonChecked.svelte';
  import IcBaselineRadioButtonUnchecked from '$lib/components/icon/IcBaselineRadioButtonUnchecked.svelte';
  import MaterialSymbolsLanguage from '$lib/components/icon/MaterialSymbolsLanguage.svelte';
  import MaterialSymbolsLogout from '$lib/components/icon/MaterialSymbolsLogout.svelte';
  import MdiThemeLightDark from '$lib/components/icon/MdiThemeLightDark.svelte';
  import Modal from '@announcing/components/Modal.svelte';
  import { LL, type Locales } from '@announcing/i18n';
  import { signOut } from '@auth/sveltekit/client';

  export let locale: Locales;
  export let showSignOut: boolean;
  export let theme: string;

  let open = false;

  export const openModal = () => {
    open = true;
  };

  $: themes = [
    ['light', $LL.default()],
    ['dark', $LL.darkMode()],
  ] as const;
</script>

<Modal bind:open dismissMode="backdrop">
  <div class="modal-body">
    <div class="language-title">
      <MaterialSymbolsLanguage />Language
    </div>
    <div class="language-grid">
      {#each localeValues as [locale_, label]}
        <button
          class="unstyled"
          on:click={() => {
            locale = locale_;
          }}
        >
          {#if locale_ === locale}
            <IcBaselineRadioButtonChecked />
          {:else}
            <IcBaselineRadioButtonUnchecked />
          {/if}
          {label}</button
        >
      {/each}
    </div>

    <hr />

    <div class="theme-title">
      <MdiThemeLightDark />
      {$LL.appearance()}
    </div>

    <div class="theme-buttons">
      {#each themes as [theme_, label]}
        <button
          class="unstyled"
          on:click={() => {
            theme = theme_;
          }}
        >
          {#if theme === theme_}
            <IcBaselineRadioButtonChecked />
          {:else}
            <IcBaselineRadioButtonUnchecked />
          {/if}
          {label}
        </button>
      {/each}
    </div>

    {#if showSignOut}
      <hr />
      <button
        class="logout-btn small"
        on:click={() => {
          return signOut();
        }}
      >
        <MaterialSymbolsLogout />
        {$LL.signOut()}
      </button>
    {/if}

    <hr />

    <button
      class="close-btn small highlight"
      on:click={() => {
        open = false;
      }}>{$LL.close()}</button
    >
  </div>
</Modal>

<style lang="scss">
  .modal-body {
    background-color: var(--color-background);
    border-radius: 8px;
    margin: auto;
    padding: 16px;
    width: 100%;
    max-width: 400px;

    hr {
      margin: 24px 0;
    }

    .language-title,
    .theme-title {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .language-grid {
      margin-top: 8px;
      display: grid;
      gap: 4px;
      justify-content: center;
      grid-template-columns: repeat(auto-fit, 80px);
      button {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
      }
    }

    .theme-buttons {
      margin-top: 8px;
      display: flex;
      justify-content: center;
      gap: 16px;
      button {
        display: flex;
        align-items: center;
        gap: 2px;
      }
    }

    .logout-btn {
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .close-btn {
      display: block;
      margin: 16px auto 0;
    }

    @keyframes showDelay {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  }
</style>
