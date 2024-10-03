<script lang="ts">
  import ChannelEditor, { type Channel } from '@announcing/components/ChannelEditor.svelte';
  import Loading from '@announcing/components/Loading.svelte';
  import { LL } from '@announcing/i18n';
  import { signOut } from '@auth/sveltekit/client';
  import SuperDebug from 'sveltekit-superforms';

  import { invalidateAll } from '$app/navigation';
  import { t } from '$lib/i18n/translations';

  import type { PageServerData } from './$types';

  export let data: PageServerData;

  let editor: ChannelEditor;
  let loading = false;

  const createChannel = async (channel: Channel) => {
    const form = new FormData();
    if (channel.name) form.append('name', channel.name);
    if (channel.desc) form.append('desc', channel.desc);
    // TODO
    //if (channel.iconFile) form.append('iconFile', channel.iconFile);

    loading = true;
    try {
      await fetch('/api/channels', {
        method: 'POST',
        body: form,
      });
      editor.closeModal();
      void invalidateAll();
    } finally {
      loading = false;
    }
  };

  $: createDisabled = data.channels.length >= 5;
</script>

<header>
  <span class="label">Announcing Writer</span>
</header>
<div class="container">
  {#if data.channels}
    <div class="channels">
      {#each data.channels as channel}
        <a href={`/channels/${channel.channelID}`} class="channel">
          <div class="head">
            <span class="name">
              {channel.name}
            </span>
            {#if channel.icon}
              <img src={channel.icon} alt="icon" />
            {/if}
          </div>
        </a>
      {/each}
    </div>
  {/if}

  <button
    class="create-btn"
    disabled={createDisabled}
    on:click={() => {
      editor.showModal();
    }}
    >{$t('top.createChannel')}
  </button>
  <span class="create-btn-desc">{$LL.channelsCanBeCreated()}</span>
  <button
    class="sign-out-btn text"
    on:click={() => {
      void signOut();
    }}>{$t('signOut')}</button
  >
</div>

<ChannelEditor
  bind:this={editor}
  on:submit={({ detail }) => {
    void createChannel(detail);
  }}
/>

<Loading show={loading} />

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

          .name {
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
    .create-btn-desc {
      margin: 8px auto;
      font-size: 13px;
      font-style: italic;
    }
    .sign-out-btn {
      margin: 30px auto;
    }
  }
</style>
