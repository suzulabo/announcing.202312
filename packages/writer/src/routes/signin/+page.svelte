<script lang="ts">
  import googleIcon from '$lib/assets/providers/google.svg?raw';
  import { t } from '$lib/i18n/translations';
  import { Button, Logo } from '@announcing/components';
  import { signIn } from '@auth/sveltekit/client';
</script>

<div class="main">
  <div class="title">
    <Logo size="40px" />
    <div class="label">Announcing Writer</div>
  </div>
  <div class="buttons">
    <Button
      on:click={() => {
        signIn('google');
      }}
      ><div class="inner">
        {@html googleIcon}<span class="label">{$t('signIn', { placeholder: 'Google' })}</span>
      </div></Button
    >
  </div>
</div>

<style lang="scss">
  .main {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px 10px;

    .title {
      display: flex;
      flex-direction: column;
      align-items: center;

      margin-bottom: 40px;

      .label {
        font-size: 24px;
      }
    }

    .buttons {
      max-width: 300px;
      display: flex;
      margin: 0 auto;
      flex-direction: column;

      .inner {
        display: inline-flex;
        align-items: center;
        .label {
          margin-left: 10px;
        }
      }
    }
  }
</style>
