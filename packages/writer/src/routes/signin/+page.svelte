<script lang="ts">
  import { signIn } from '@auth/sveltekit/client';
  import { PUBLIC_AUTH_CARDINALS } from '$env/static/public';
  import GoogleIcon from '$lib/components/icon/GoogleIcon.svelte';
</script>

<div class="container">
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
      ><div class="inner">
        <GoogleIcon /><span class="label"></span>
      </div></button
    >
  </div>
</div>

<style lang="scss">
  .container {
    padding: 20px 10px;

    .buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 8px;

      button {
        width: 100%;
        height: 55px;

        .inner {
          display: inline-flex;
          align-items: center;
          .label {
            margin-left: 10px;
          }
        }
      }
    }
  }
</style>
