<script lang="ts">
  import { page } from '$app/stores';
  import { t } from '$lib/i18n/translations';
  import Logo from '@announcing/components/Logo.svelte';
  import { signOut } from '@auth/sveltekit/client';

  const userID = $page.data.session?.user?.id;
  $: path = $page.url.pathname;
</script>

{#if userID}
  <header>
    {#if path === '/'}
      <Logo size="20px" />
      <span class="label">Announcing Writer</span>
    {:else}
      <a href="/">{$t('back')}</a>
    {/if}
    <button
      on:click={() => {
        signOut();
      }}>{$t('signOut')}</button
    >
  </header>
{/if}

<slot />

<style lang="scss">
  header {
    display: flex;
    align-items: center;
    padding: 8px;
    border-bottom: 1px solid var(--color-border);

    button {
      margin-left: auto;
      padding: 4px 8px;
    }
  }
</style>
