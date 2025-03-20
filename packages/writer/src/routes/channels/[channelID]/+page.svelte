<script lang="ts">
  import { LL } from '@announcing/i18n';

  import { goto, invalidateAll } from '$app/navigation';
  import { page } from '$app/state';
  import { PUBLIC_READER_PREFIX } from '$env/static/public';
  import ChannelEditor from '$lib/components/ChannelEditor.svelte';

  import MaterialSymbolsContentCopyOutline from '$lib/components/icon/MaterialSymbolsContentCopyOutline.svelte';
  import MdiExternalLink from '$lib/components/icon/MdiExternalLink.svelte';
  import type { PageData } from './$types';
  import DeleteModal from './DeleteModal.svelte';
  import UrlCopyModal from './UrlCopyModal.svelte';
  import MaterialSymbolsPostAdd from '$lib/components/icon/MaterialSymbolsPostAdd.svelte';
  import MaterialSymbolsEditDocumentOutline from '$lib/components/icon/MaterialSymbolsEditDocumentOutline.svelte';
  import MaterialSymbolsBoxEditOutline from '$lib/components/icon/MaterialSymbolsBoxEditOutline.svelte';
  import MaterialSymbolsDangerous from '$lib/components/icon/MaterialSymbolsDangerous.svelte';
  import { resolveStoragePath } from '$lib/utils/resolveStoragePath';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let urlCopyModal: ReturnType<typeof UrlCopyModal>;
  let deleteModal: ReturnType<typeof DeleteModal>;
  let channelEditor: ReturnType<typeof ChannelEditor>;

  let { channel } = $derived(data);
  let channelID = $derived(channel.channelID);
  let readerURL = $derived(`${PUBLIC_READER_PREFIX}/${channelID}`);

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

  const iconProps = {
    width: '20px',
    height: '20px',
  };
</script>

<div class="container">
  <div class="name-box">
    <span class="name">{channel.name}</span>
    {#if channel.icon}
      <img class="icon" alt="channel icon" src={resolveStoragePath(channel.icon)} />
    {/if}
  </div>

  <hr />

  <ul class="actions">
    <li>
      <a href={readerURL}>
        <MdiExternalLink {...iconProps} />
        {$LL.channelActions.viewChannel()}</a
      >
    </li>
    <li>
      <button
        class="text"
        onclick={() => {
          urlCopyModal.openModal(readerURL);
        }}
      >
        <MaterialSymbolsContentCopyOutline {...iconProps} />
        {$LL.channelActions.copyURL()}</button
      >
    </li>
    <hr />
    <li>
      <a href={`${page.url.pathname}/announcements`}>
        <MaterialSymbolsPostAdd {...iconProps} />
        {$LL.channelActions.createAnnouncement()}
      </a>
    </li>
    <li>
      <a href={`${page.url.pathname}/announcements/list`}>
        <MaterialSymbolsEditDocumentOutline {...iconProps} />
        {$LL.channelActions.editAnnouncement()}</a
      >
    </li>
    <hr />
    <li>
      <button
        class="text"
        onclick={() => {
          channelEditor.openEditor(channel);
        }}
      >
        <MaterialSymbolsBoxEditOutline {...iconProps} />
        {$LL.channelActions.editChannel()}</button
      >
    </li>
    <hr />
    <li>
      <button
        class="text"
        onclick={() => {
          deleteModal.openModal();
        }}
      >
        <MaterialSymbolsDangerous {...iconProps} />
        {$LL.channelActions.deleteChannel()}</button
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
        border-radius: 8px;
      }
    }

    hr {
      margin: 16px 0;
    }

    .actions {
      li {
        margin: 8px 24px;
        a,
        button {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        button {
          padding: 0;
        }
      }
    }
  }
</style>
