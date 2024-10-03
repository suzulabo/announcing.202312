<script lang="ts">
  import { signIn } from '@auth/sveltekit/client';

  import { env } from '$env/dynamic/public';
  import GoogleIcon from '$lib/components/icon/GoogleIcon.svelte';
</script>

<div class="container">
  <div class="buttons">
    <button
      on:click={() => {
        void signIn('google');
      }}
      ><div class="inner">
        <GoogleIcon /><span class="label"></span>
      </div></button
    >
    {#if env.PUBLIC_TEST}
      <button
        on:click={() => {
          void signIn('credentials', { id: `test_user-${Math.random().toString()}` });
        }}>Credentials</button
      >
    {/if}
  </div>
</div>

<style lang="scss">
  .container {
    padding: 20px 10px;

    .buttons {
      text-align: center;

      button {
        display: inline-block;
        width: 90%;
        min-width: 200px;
        max-width: 300px;
        margin: 0 0 20px;

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
