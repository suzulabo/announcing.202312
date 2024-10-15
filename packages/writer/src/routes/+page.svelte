<script lang="ts">
  import { imgSrc } from '@announcing/components/actions/imgSrc';
  import { LL } from '@announcing/i18n';

  import { invalidateAll } from '$app/navigation';
  import ChannelEditor from '$lib/components/ChannelEditor.svelte';

  import type { PageServerData } from './$types';

  export let data: PageServerData;

  let editor: ChannelEditor;

  const submitHandler = async (formData: FormData) => {
    await fetch('/api/channels', {
      method: 'POST',
      body: formData,
    });
    await invalidateAll();
  };

  $: createDisabled = data.channels.length >= 5;
</script>

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
              <img alt="icon" use:imgSrc={channel.icon} />
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
      editor.openEditor();
    }}
    >{$LL.createChannel()}
  </button>
  <span class="create-btn-desc">{$LL.channelsCanBeCreated()}</span>
</div>

<ChannelEditor bind:this={editor} onSubmit={submitHandler} />

<style lang="scss">
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
  }
</style>
