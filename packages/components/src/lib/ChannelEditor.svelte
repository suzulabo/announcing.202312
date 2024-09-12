<script lang="ts" context="module">
  type Channel = {
    iconFile?: File | undefined;
    title?: string | undefined;
    desc?: string | undefined;
  };
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { loadImage } from './actions/loadImage';
  import {
    CHANNEL_DESC_MAX_BYTES,
    CHANNEL_ICON_MAX_SIZE,
    CHANNEL_TITLE_MAX_BYTES,
  } from './constants';
  import FileInput from './FileInput.svelte';
  import LL from './i18n/i18n-svelte';
  import Input from './Input.svelte';
  import Modal from './Modal.svelte';
  import TextArea from './TextArea.svelte';

  export let channel: Channel | undefined = undefined;

  const dispatcher = createEventDispatcher<{ dismiss: undefined; submit: Channel }>();
  let fileInput: FileInput;

  $: form = { ...channel } as Channel;
  $: validated = !!form.title;
</script>

<Modal show={true} dismissMode="none" padding="8px">
  <div class="modal-body">
    <Input
      name="title"
      label={$LL.title()}
      bind:value={form.title}
      maxBytes={CHANNEL_TITLE_MAX_BYTES}
    />
    <TextArea
      name="desc"
      label={$LL.desc()}
      bind:value={form.desc}
      maxBytes={CHANNEL_DESC_MAX_BYTES}
      maxHeight="40vh"
    />
    <div class="icon-box">
      {#if form.iconFile}
        <button
          class="unstyled"
          on:click={() => {
            fileInput.open();
          }}
        >
          <img class="icon" alt="icon preview" use:loadImage={form.iconFile} />
        </button>
      {/if}
      {#if !form.iconFile}
        <button
          type="button"
          class="small"
          on:click={() => {
            fileInput.open();
          }}>{$LL.iconSelect()}</button
        >
      {/if}
      {#if form.iconFile}
        <button
          type="button"
          class="small"
          on:click={() => {
            form.iconFile = undefined;
          }}>{$LL.iconRemove()}</button
        >
      {/if}
      <FileInput
        name="icon"
        accept="image/jpeg,image/png,image/webp"
        maxImageSize={CHANNEL_ICON_MAX_SIZE}
        bind:this={fileInput}
        bind:file={form.iconFile}
      />
    </div>
    <button
      disabled={!validated}
      class="submit-btn"
      on:click={() => {
        dispatcher('submit', form);
      }}>{$LL.createChannel()}</button
    >
    <button
      class="small text cancel-btn"
      on:click={() => {
        dispatcher('dismiss');
      }}>{$LL.cancel()}</button
    >
  </div>
</Modal>

<style lang="scss">
  .modal-body {
    background-color: var(--color-background);
    border-radius: 8px;
    width: 100%;
    max-width: 600px;
    margin: auto;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .icon-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      .icon {
        width: 64px;
        height: 64px;
        border-radius: 8px;
        object-fit: contain;
      }
    }

    .submit-btn {
      align-self: center;
    }

    .cancel-btn {
      align-self: center;
    }
  }
</style>
