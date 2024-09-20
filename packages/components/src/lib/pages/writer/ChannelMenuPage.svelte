<script lang="ts" context="module">
  export type Channel = {
    id: string;
    name: string;
    icon: string | undefined;
  };
</script>

<script lang="ts">
  import { LL } from '$lib/i18n';
  import Loading from '$lib/Loading.svelte';

  import DeleteModal from './DeleteModal.svelte';
  import UrlCopyModal from './UrlCopyModal.svelte';

  export let channel: Channel;
  export let readerPrefix: string;
  export let deleteClick: () => Promise<void>;

  let urlCopyModal: UrlCopyModal;
  let deleteModal: DeleteModal;
  let loading = false;

  const handleDeleteClick = async () => {
    loading = true;
    try {
      await deleteClick();
    } finally {
      loading = false;
    }
  };
</script>

<div class="container">
  <div class="header">
    <a href="/">{$LL.back()}</a>
  </div>

  <div class="name-box">
    <span class="name">{channel.name}</span>
    {#if channel.icon}
      <img class="icon" src={channel.icon} alt="channel icon" />
    {/if}
  </div>

  <hr />

  <div class="actions-instruction">{$LL.channelActions.instruction()}</div>

  <ul class="actions">
    <li>
      <a href={`${readerPrefix}${channel.id}`}>{$LL.channelActions.viewChannel()}</a>
    </li>
    <li>
      <button
        class="text"
        on:click={() => {
          urlCopyModal.showModal();
        }}>{$LL.channelActions.copyURL()}</button
      >
    </li>
    <li>
      <button class="text">{$LL.channelActions.createAnnouncement()}</button>
    </li>
    <li>
      <button class="text">{$LL.channelActions.editAnnouncement()}</button>
    </li>
    <li>
      <button class="text">{$LL.channelActions.editChannel()}</button>
    </li>
    <hr />
    <li>
      <button
        class="text"
        on:click={() => {
          deleteModal.showModal();
        }}>{$LL.channelActions.deleteChannel()}</button
      >
    </li>
  </ul>
</div>

<UrlCopyModal bind:this={urlCopyModal} url={`${readerPrefix}${channel.id}`} />
<DeleteModal bind:this={deleteModal} name={channel.name} deleteClick={handleDeleteClick} />

<Loading show={loading} />

<style lang="scss">
  .container {
    padding: 8px;
    max-width: 600px;
    margin: 0 auto;

    .header {
      display: flex;
    }

    .name-box {
      display: flex;
      align-items: center;
      margin: 0 0 16px 0;
      .name {
        font-size: 22px;
      }
      .icon {
        width: 64px;
        height: 64px;
        margin: 0 0 0 auto;
      }
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
