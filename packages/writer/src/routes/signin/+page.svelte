<script lang="ts">
  import Logo from '@announcing/components/Logo.svelte';
  import { signIn } from '@auth/sveltekit/client';

  import { env } from '$env/dynamic/public';
  import GoogleIcon from '$lib/components/icon/GoogleIcon.svelte';
  import { t } from '$lib/i18n/translations';
</script>

<div class="container">
  <div class="title">
    <Logo size="40px" />
    <div class="label">Announcing Writer</div>
  </div>
  <div class="buttons">
    <button
      on:click={() => {
        void signIn('google');
      }}
      ><div class="inner">
        <GoogleIcon /><span class="label">{$t('signIn', { value: 'Google' })}</span>
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

    .title {
      text-align: center;

      margin-bottom: 40px;

      .label {
        font-size: 24px;
      }
    }

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
