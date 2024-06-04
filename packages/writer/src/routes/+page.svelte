<script lang="ts">
  import { t } from '$lib/i18n/translations';
  import Logo from '@announcing/components/Logo.svelte';
  import { signOut } from '@auth/sveltekit/client';
  import SuperDebug from 'sveltekit-superforms';
  import type { PageServerData } from './$types';

  export let data: PageServerData;
</script>

<header>
  <Logo size="20px" />
  <span class="label">Announcing Writer</span>
</header>
<div class="container">
  {#if data.channels}
    <div class="channels">
      {#each data.channels as channel}
        <a href={`/t/${channel.channelID}`} class="channel">
          <div class="head">
            <span class="title">
              {channel.title}
            </span>
            {#if channel.icon}
              <img src={`/s/${channel.icon}`} alt="icon" />
            {/if}
          </div>
        </a>
      {/each}
    </div>
  {/if}

  <a
    class="button create-btn"
    href="/t/new/w"
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

<SuperDebug {data} />

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

    .channels {
      margin: 0 0 20px;
      display: grid;
      gap: 15px;
      justify-content: center;
      grid-template-columns: repeat(auto-fit, minmax(300px, 350px));

      .channel {
        border: 1px solid var(--color-border);
        border-radius: 8px;
        padding: 8px;
        min-height: 100px;

        .head {
          display: flex;
          align-items: center;

          .title {
            flex-grow: 1;
          }

          img {
            width: 64px;
            height: 64px;
            border-radius: 8px;
            object-fit: contain;
          }
        }
      }
    }

    .create-btn {
      margin: 0 auto;
    }
    .sign-out-btn {
      margin: 30px auto;
    }
  }
</style>
