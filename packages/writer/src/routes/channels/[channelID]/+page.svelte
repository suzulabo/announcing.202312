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
  import { clearFetchChannelsCache } from '$lib/fetch/fetchChannels';

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
    const res = await fetch(`/api/channels/${channelID}`, {
      method: 'PUT',
      body: formData,
    });

    if (!res.ok) {
      await goto('/error');
      return;
    }

    clearFetchChannelsCache();

    await invalidateAll();
  };

  const deleteChannel = async () => {
    const res = await fetch(`/api/channels/${channelID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updatedAt: channel.updatedAt }),
    });

    if (!res.ok) {
      await goto('/error');
      return;
    }

    clearFetchChannelsCache();

    await goto('/');
  };

  const iconProps = {
    width: '20px',
    height: '20px',
  };
</script>

<div class="container">
  <ul class="actions">
    <li>
      <a class="button text" href={readerURL}>
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
      <a class="button text" href={`${page.url.pathname}/announcements`}>
        <MaterialSymbolsPostAdd {...iconProps} />
        {$LL.channelActions.createAnnouncement()}
      </a>
    </li>
    <li>
      <a class="button text" href={`${page.url.pathname}/announcements/list`}>
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
    padding: 0 8px;

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
      }
    }
  }
</style>
