<script lang="ts">
  import { signIn } from '@auth/sveltekit/client';
  import { PUBLIC_AUTH_CARDINALS } from '$env/static/public';
  import GoogleIcon from '$lib/components/icon/GoogleIcon.svelte';
  import { LL } from '@announcing/i18n';
</script>

<div class="buttons">
  {#if PUBLIC_AUTH_CARDINALS}
    <button
      onclick={() => {
        void signIn('credentials', { id: 'test_user01' });
      }}>Credentials</button
    >
  {/if}
  <button
    onclick={() => {
      void signIn('google');
    }}
  >
    <GoogleIcon />
    {$LL.signIn.google()}
  </button>
</div>

<style lang="scss">
  .buttons {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: auto;

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      max-width: 300px;
    }
  }
</style>
