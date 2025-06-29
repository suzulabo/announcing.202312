<script lang="ts">
  import Loading from '$lib/atoms/Loading.svelte';
  import Modal from '$lib/atoms/Modal.svelte';
  import MaterialSymbolsLanguage from '$lib/icons/MaterialSymbolsLanguage.svelte';
  import MdiThemeLightDark from '$lib/icons/MdiThemeLightDark.svelte';
  import { getTheme, initTheme, setLocale, setTheme, type Themes } from '$lib/utils/settings';
  import { LL, type Locales } from '@announcing/i18n';
  import { onMount } from 'svelte';

  const localeValues = [
    ['en', 'English'],
    ['ja', '日本語'],
  ] satisfies [Locales, string][];

  interface Props {
    requestLocale: Locales;
    requestTheme: Themes | undefined;
  }

  let { requestLocale, requestTheme }: Props = $props();

  let open = $state(false);
  let loading = $state(false);
  let locale = $state(requestLocale);
  let theme = $state(requestTheme ?? getTheme());

  let themes = $derived<[Themes, string][]>([
    ['light', $LL.lightMode()],
    ['dark', $LL.darkMode()],
  ]);

  onMount(() => {
    initTheme();
  });

  $effect(() => {
    loading = true;
    setLocale(locale)
      .catch(() => {
        //
      })
      .finally(() => {
        loading = false;
      });
  });

  $effect(() => {
    setTheme(theme);
  });

  export const openModal = () => {
    open = true;
  };
</script>

<div id="settings" data-locale={locale} data-theme={theme}></div>

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

    <button
      class="close-btn small filled"
      onclick={() => {
        open = false;
      }}>{$LL.close()}</button
    >
  </div>
</Modal>

<Loading show={loading} showDelay="0.5s" />

<style lang="scss">
  #settings {
    display: none;
  }

  .modal-body {
    background-color: var(--color-background);
    border-radius: 16px;
    margin: auto;
    padding: 16px;
    width: 100%;
    max-width: 400px;

    .language-title,
    .theme-title {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .language-grid {
      margin: 16px 0 32px;
      display: grid;
      gap: 16px;
      justify-content: center;
      grid-template-columns: repeat(auto-fit, 80px);
    }

    .theme-buttons {
      margin: 16px 0 32px;
      display: flex;
      justify-content: center;
      gap: 16px;
    }

    .close-btn {
      display: block;
      margin: 0 auto;
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
