<script lang="ts">
  import Modal from '$lib/atoms/Modal.svelte';
  import MaterialSymbolsLanguage from '$lib/icons/MaterialSymbolsLanguage.svelte';
  import MaterialSymbolsLogout from '$lib/icons/MaterialSymbolsLogout.svelte';
  import MdiThemeLightDark from '$lib/icons/MdiThemeLightDark.svelte';
  import { getTheme, initTheme, setTheme, type Themes } from '$lib/utils/settings';
  import { LL, type Locales } from '@announcing/i18n';
  import { onMount } from 'svelte';

  const localeValues = [
    ['en', 'English'],
    ['ja', '日本語'],
  ] satisfies [Locales, string][];

  interface Props {
    requestTheme: Themes | undefined;
    onLocaleChange: (locale: Locales) => Promise<void>;
    onSignOut?: () => void;
  }

  let { requestTheme, onLocaleChange, onSignOut }: Props = $props();

  let theme = $state(requestTheme ?? getTheme());

  let values = $state<{
    open: boolean;
    locale?: Locales;
  }>({ open: false });

  let themes = $derived<[Themes, string][]>([
    ['light', $LL.lightMode()],
    ['dark', $LL.darkMode()],
  ]);

  onMount(() => {
    initTheme();
  });

  $effect(() => {
    setTheme(theme);
  });

  export const openModal = (locale: Locales) => {
    values = {
      open: true,
      locale,
    };
  };
</script>

<div id="settings" data-theme={theme}></div>

<Modal bind:open={values.open} dismissMode="backdrop">
  <div class="modal-body">
    <div class="language-title">
      <MaterialSymbolsLanguage />Language
    </div>
    <div class="language-grid">
      {#each localeValues as [value, label] (value)}
        <label>
          <input
            type="radio"
            name="locale"
            {value}
            bind:group={values.locale}
            onchange={() => {
              void onLocaleChange(value);
            }}
          />
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
        values.open = false;
      }}>{$LL.close()}</button
    >
  </div>
</Modal>

<style lang="scss">
  #settings {
    display: none;
  }

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
