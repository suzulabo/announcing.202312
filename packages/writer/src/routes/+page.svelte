<script lang="ts">
  import { t } from '$lib/i18n/translations';
  import Logo from '@announcing/components/Logo.svelte';
  import { signOut } from '@auth/sveltekit/client';
  import SuperDebug from 'sveltekit-superforms';
  import type { PageData } from './$types';

  export let data: PageData;

  data.threads;
</script>

<SuperDebug {data} />

<header>
  <Logo size="20px" />
  <span class="label">Announcing Writer</span>
</header>
<div class="container">
  {#if data.threads}
    <div class="threads">
      {#each data.threads as thread}
        <a href={`/thread/${thread.threadID}`} class="thread">
          {thread.title}
          {#if thread.icon}
            <img src={`/s/${thread.icon}`} alt="icon" />
          {/if}
        </a>
      {/each}
    </div>
  {/if}

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
