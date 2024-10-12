<script lang="ts">
  import { LL } from '@announcing/i18n';

  import { goto, invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { PUBLIC_READER_PREFIX } from '$env/static/public';
  import ChannelEditor from '$lib/components/ChannelEditor.svelte';
  import { normalizePath } from '$lib/utils/normalizePath';

  import type { PageData } from './$types';
  import DeleteModal from './DeleteModal.svelte';
  import UrlCopyModal from './UrlCopyModal.svelte';

  export let data: PageData;

  let urlCopyModal: UrlCopyModal;
  let deleteModal: DeleteModal;
  let channelEditor: ChannelEditor;

  $: ({ channel } = data);
  $: channelID = channel.channelID;
  $: readerURL = `${PUBLIC_READER_PREFIX}${channelID}`;

  const updateChannel = async (formData: FormData) => {
    formData.append('updatedAt', channel.updatedAt + '');
    await fetch(`/api/channels/${channelID}`, {
      method: 'PUT',
      body: formData,
    });
    await invalidateAll();
  };

  const deleteChannel = async () => {
    await fetch(`/api/channels/${channelID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updatedAt: channel.updatedAt }),
    });
    await goto('/');
  };
</script>

<div class="container">
  <div class="name-box">
    <span class="name">{channel.name}</span>
    {#if channel.icon}
      <img class="icon" src={normalizePath(channel.icon)} alt="channel icon" />
    {/if}
  </div>
  {#if channel.desc}
    <div>{channel.desc}</div>
  {/if}

  <hr />

  <div class="actions-instruction">{$LL.channelActions.instruction()}</div>

  <ul class="actions">
    <li>
      <a href={readerURL}>{$LL.channelActions.viewChannel()}</a>
    </li>
    <li>
      <button
        class="text"
        on:click={() => {
          urlCopyModal.openModal(readerURL);
        }}>{$LL.channelActions.copyURL()}</button
      >
    </li>
    <li>
      <a href={`${$page.url.pathname}/announcements`}>
        {$LL.channelActions.createAnnouncement()}
      </a>
    </li>
    <li>
      <a href={`${$page.url.pathname}/announcements/list`}
        >{$LL.channelActions.editAnnouncement()}</a
      >
    </li>
    <li>
      <button
        class="text"
        on:click={() => {
          channelEditor.openEditor(channel);
        }}>{$LL.channelActions.editChannel()}</button
      >
    </li>
    <hr />
    <li>
      <button
        class="text"
        on:click={() => {
          deleteModal.openModal();
        }}>{$LL.channelActions.deleteChannel()}</button
      >
    </li>
  </ul>
</div>

<UrlCopyModal bind:this={urlCopyModal} />
<DeleteModal bind:this={deleteModal} name={channel.name} onSubmit={deleteChannel} />
<ChannelEditor bind:this={channelEditor} onSubmit={updateChannel} />

<style lang="scss">
  .container {
    padding: 16px 8px;

    .name-box {
      display: flex;
      align-items: center;
      min-height: 64px;
      .name {
        font-size: 22px;
      }
      .icon {
        width: 64px;
        height: 64px;
        margin: 0 0 0 auto;
      }
    }

    hr {
      margin: 16px 0;
    }

    .actions-instruction {
      margin: 16px;
    }
    .actions {
      list-style: inside;
      li {
        margin: 8px 24px;
      }
      hr {
        margin: 12px 0;
      }
    }
  }
</style>
