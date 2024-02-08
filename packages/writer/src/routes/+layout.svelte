<script lang="ts">
  import { page } from '$app/stores';
  import Logo from '@announcing/components/Logo.svelte';
  import { signOut } from '@auth/sveltekit/client';

  const userID = $page.data.session?.user?.id;
</script>

{#if userID}
  <header>
    <Logo size="20px" />
    <span class="label">Announcing Writer</span>
    <button
      on:click={() => {
        signOut();
      }}>Sign out</button
    >
  </header>
{/if}

<slot />

<style lang="scss">
  header {
    display: flex;
    align-items: center;
  }
</style>
