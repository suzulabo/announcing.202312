<script lang="ts" context="module">
  const loadFile = async (file: File | null) => {
    if (!file) {
      return '';
    }
    return new Promise<string>((resolve) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        resolve(event.target?.result as string);
      };

      reader.readAsDataURL(file);
    });
  };
</script>

<script lang="ts">
  import { loadImage } from './actions/loadImage';
  import { loadChannelViewComponents } from './ChannelView/loader';
  import FileInput from './FileInput.svelte';
  import LL from './i18n/i18n-svelte';
  import Input from './Input.svelte';
  import Modal from './Modal.svelte';
  import TextArea from './TextArea.svelte';

  export let channel: {
    icon: File | null;
    title: string;
    desc: string;
  };

  export let params: {
    backUrl: string;
  };

  const { ChannelView } = loadChannelViewComponents('default');

  let showModal = true;
  let fileInput: FileInput;
  const form = { ...channel };

  $: validated = !!form.title;
</script>

<div class="preview">
  {#await loadFile(channel.icon) then iconUrl}
    <ChannelView params={{ channel: { ...channel, icon: iconUrl }, preview: true }} />
  {/await}
  <div>
    <a href={params.backUrl}>{$LL.back()}</a>
  </div>
</div>

<Modal bind:show={showModal} dismissMode="none" padding="8px">
  <div class="modal-body">
    <div class="icon-box">
      {#if form.icon}
        <button
          class="unstyled"
          on:click={() => {
            fileInput.open();
          }}
        >
          <img class="icon" alt="icon preview" use:loadImage={form.icon} />
        </button>
      {/if}
      <div>
        <button
          type="button"
          class="small"
          on:click={() => {
            fileInput.open();
          }}>{$LL.iconSelect()}</button
        >
        {#if form.icon}
          <button
            type="button"
            class="small"
            on:click={() => {
              form.icon = null;
            }}>{$LL.iconRemove()}</button
          >
        {/if}
      </div>
      <FileInput
        name="icon"
        accept="image/jpeg,image/png,image/webp"
        maxImageSize={256}
        bind:this={fileInput}
        bind:file={form.icon}
      />
    </div>
    <Input name="title" label={$LL.title()} bind:value={form.title} maxBytes={100} />
    <TextArea
      name="desc"
      label={$LL.desc()}
      bind:value={form.desc}
      maxBytes={1000}
      maxHeight="40vh"
    />
    <button
      disabled={!validated}
      class="preview-btn"
      on:click={() => {
        channel = { ...form };
        showModal = false;
      }}>{$LL.preview()}</button
    >
    <button
      class="small cancel-btn"
      on:click={() => {
        showModal = false;
      }}>{$LL.cancel()}</button
    >
  </div>
</Modal>

<style lang="scss">
  .preview {
    min-height: 200px;
  }
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
      text-align: center;

      .icon {
        width: 64px;
        height: 64px;
        border-radius: 8px;
        object-fit: contain;
      }
    }

    .preview-btn {
      align-self: center;
    }

    .cancel-btn {
      align-self: center;
    }
  }
</style>
