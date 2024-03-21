<script lang="ts">
  import GoogleIcon from '$lib/components/icon/GoogleIcon.svelte';
  import { t } from '$lib/i18n/translations';
  import Logo from '@announcing/components/Logo.svelte';
  import { signIn } from '@auth/sveltekit/client';
</script>

<div class="container">
  <div class="title">
    <Logo size="40px" />
    <div class="label">Announcing Writer</div>
  </div>
  <div class="buttons">
    <button
      on:click={() => {
        signIn('google');
      }}
      ><div class="inner">
        <GoogleIcon /><span class="label">{$t('signIn', { placeholder: 'Google' })}</span>
      </div></button
    >
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
        width: 90%;
        min-width: 200px;
        max-width: 300px;

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
