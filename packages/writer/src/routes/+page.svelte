<script lang="ts">
  import { page } from '$app/stores';
  import { Button } from '@announcing/components';
  import { signOut } from '@auth/sveltekit/client';
</script>

{#if $page.data.session}
  <Button
    on:click={() => {
      signOut();
    }}>Sign Out</Button
  >
  ID: [{$page.data.session.user?.id}]
{:else}
  <a href="./signin">SignIn</a>
{/if}
