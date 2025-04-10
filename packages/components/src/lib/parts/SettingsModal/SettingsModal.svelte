<script lang="ts">
  import Modal from '$lib/atoms/Modal.svelte';
  import MaterialSymbolsLanguage from '$lib/icons/MaterialSymbolsLanguage.svelte';
  import MaterialSymbolsLogout from '$lib/icons/MaterialSymbolsLogout.svelte';
  import MdiThemeLightDark from '$lib/icons/MdiThemeLightDark.svelte';
  import { LL, type Locales } from '@announcing/i18n';

  const localeValues = [
    ['en', 'English'],
    ['ja', '日本語'],
  ] satisfies [Locales, string][];

  interface Props {
    locale: Locales;
    theme: string;
    onSignOut?: () => void;
  }

  let { locale = $bindable(), theme = $bindable(), onSignOut }: Props = $props();

  // TODO: https://github.com/sveltejs/language-tools/issues/2268
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  locale;
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  theme;

  let open = $state(false);

  export const openModal = () => {
    open = true;
  };

  let themes = $derived([
    ['light', $LL.lightMode()],
    ['dark', $LL.darkMode()],
  ] as const);
</script>

<Modal bind:open dismissMode="backdrop">
  <div class="modal-body">
    <div class="language-title">
      <MaterialSymbolsLanguage />Language
    </div>
    <div class="language-grid">
      {#each localeValues as [value, label] (value)}
        <label>
          <input type="radio" name="locale" {value} bind:group={locale} />
          {label}
        </label>
      {/each}
    </div>

    <hr />

    <div class="theme-title">
      <MdiThemeLightDark />
      {$LL.theme()}
    </div>

    <div class="theme-buttons">
      {#each themes as [value, label] (value)}
        <label>
          <input type="radio" name="theme" {value} bind:group={theme} />
          {label}
        </label>
      {/each}
    </div>

    {#if onSignOut}
      <hr />
      <button
        class="logout-btn small"
        onclick={() => {
          onSignOut();
        }}
      >
        <MaterialSymbolsLogout />
        {$LL.signOut()}
      </button>
    {/if}

    <hr />

    <button
      class="close-btn small filled"
      onclick={() => {
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
      gap: 16px;
      justify-content: center;
      grid-template-columns: repeat(auto-fit, 80px);
    }

    .theme-buttons {
      margin-top: 8px;
      display: flex;
      justify-content: center;
      gap: 16px;
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
