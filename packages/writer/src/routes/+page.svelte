<script lang="ts">
  import { t } from '$lib/i18n/translations';
  import Logo from '@announcing/components/Logo.svelte';
  import { signOut } from '@auth/sveltekit/client';
</script>

<header>
  <Logo size="20px" />
  <span class="label">Announcing Writer</span>
</header>
<div class="container">
  <a
    class="button create-btn"
    href="./create"
    on:click={() => {
      //
    }}
    >{$t('createAnnouncement')}
  </a>
  <button
    class="sign-out-btn text"
    on:click={() => {
      signOut();
    }}>{$t('signOut')}</button
  >
</div>

<style lang="scss">
  header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-bottom: 1px solid var(--color-border);
  }
  .container {
    display: flex;
    flex-direction: column;
    margin: 20px 0;

    .create-btn {
      margin: 0 auto;
    }
    .sign-out-btn {
      margin: 30px auto;
    }
  }
</style>
