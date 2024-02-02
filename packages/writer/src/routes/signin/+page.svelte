<script lang="ts">
  import { Button } from '@announcing/components';
  import { signIn } from '@auth/sveltekit/client';
  import googleIcon from '$lib/assets/providers/google.svg?raw';
  import { t } from '$lib/i18n/translations';
</script>

<Button
  on:click={() => {
    signIn('google');
  }}
  ><div class="sign-in-button-inner">
    {@html googleIcon}<span class="label">{$t('signIn', { placeholder: 'Google' })}</span>
  </div></Button
>

<style lang="scss">
  .sign-in-button-inner {
    display: inline-flex;
    align-items: center;
    .label {
      margin-left: 10px;
    }
  }
</style>
