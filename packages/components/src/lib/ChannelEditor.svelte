<script lang="ts">
  import { loadImage } from './actions/loadImage';
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

  let showModal = true;
  let fileInput: FileInput;
  let form = { ...channel };

  $: validated = !!form.title;
</script>

<Modal bind:show={showModal} padding="8px">
  <div class="modal-body">
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
        on:click={() => {
          fileInput.open();
        }}>{$LL.iconSelect()}</button
      >
      {#if form.icon}
        <button
          type="button"
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
    <Input name="title" label={$LL.title()} bind:value={form.title} maxBytes={100} />
    <TextArea name="desc" label={$LL.desc()} bind:value={form.desc} maxBytes={1000} />
    <button
      disabled={!validated}
      on:click={() => {
        channel = { ...form };
        showModal = false;
      }}>{$LL.preview()}</button
    >
    <button
      on:click={() => {
        showModal = false;
      }}>{$LL.cancel()}</button
    >
  </div>
</Modal>

<div class="preview">
  <div>{channel.title}</div>
  <div>{channel.desc}</div>
  <div><a href={params.backUrl}>{$LL.cancel()}</a></div>
  <div>
    <button
      on:click={() => {
        form = { ...channel };
        showModal = true;
      }}>{$LL.edit()}</button
    >
  </div>
</div>

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

    .icon {
      width: 64px;
      height: 64px;
      border-radius: 8px;
      object-fit: contain;
    }
  }
</style>
