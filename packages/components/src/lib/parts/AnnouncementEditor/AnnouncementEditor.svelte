<script lang="ts" context="module">
  export type Announcement = {
    headerImage?: string | undefined;
    headerImageFile?: File | undefined;
    title?: string | undefined;
    body: string;
    images?: string[] | undefined;
    imagesFiles?: File[] | undefined;
    updatedAt: Date;
    createdAt: Date;
  };
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { loadImage } from '$lib/actions/loadImage';
  import FileInput from '$lib/atoms/FileInput.svelte';
  import Input from '$lib/atoms/Input.svelte';
  import Modal from '$lib/atoms/Modal.svelte';
  import TextArea from '$lib/atoms/TextArea.svelte';
  import {
    ANNOUNCEMENT_BODY_MAX_BYTES,
    ANNOUNCEMENT_HEADER_IMAGE_MAX_SIZE,
    ANNOUNCEMENT_TITLE_MAX_BYTES,
  } from '$lib/constants';
  import { LL } from '$lib/i18n';

  export let announcement: Announcement | undefined = undefined;

  export const showModal = () => {
    form = { ...announcement };
    modal.showModal();
  };
  export const closeModal = () => {
    modal.closeModal();
  };

  const dispatcher = createEventDispatcher<{ submit: Partial<Announcement> }>();

  let modal: Modal;
  let form: Partial<Announcement> = {};
  let titleError = false;
  let bodyError = false;
  let headerImageFileInput: FileInput;

  $: validated = !!form.body && !titleError && !bodyError;
</script>

<Modal bind:this={modal} dismissMode="none">
  <div class="modal-body">
    <div class="header-image">
      {#if form.headerImage ?? form.headerImageFile}
        <button
          class="unstyled"
          on:click={() => {
            headerImageFileInput.open();
          }}
        >
          {#if form.headerImageFile}
            <img class="icon" alt="icon preview" use:loadImage={form.headerImageFile} />
          {:else}
            <img class="icon" alt="icon preview" src={form.headerImage} />
          {/if}
        </button>
        <button
          type="button"
          class="small"
          on:click={() => {
            form.headerImage = undefined;
            form.headerImageFile = undefined;
          }}>{$LL.removeHeaderImage()}</button
        >
      {:else}
        <button
          on:click={() => {
            headerImageFileInput.open();
          }}>{$LL.chooseHeaderImage()}</button
        >
      {/if}
      <FileInput
        name="headerImage"
        accept="image/jpeg,image/png,image/webp"
        maxImageSize={ANNOUNCEMENT_HEADER_IMAGE_MAX_SIZE}
        bind:this={headerImageFileInput}
        bind:file={form.headerImageFile}
      />
    </div>
    <Input
      name="title"
      label={$LL.title()}
      bind:value={form.title}
      maxBytes={ANNOUNCEMENT_TITLE_MAX_BYTES}
      bind:error={titleError}
    />
    <TextArea
      name="body"
      label={$LL.body()}
      bind:value={form.body}
      maxBytes={ANNOUNCEMENT_BODY_MAX_BYTES}
      maxHeight="40vh"
      required
      bind:error={bodyError}
    />
    <button
      disabled={!validated}
      class="submit-btn"
      on:click={() => {
        if (form.headerImageFile) {
          form.headerImage = undefined;
        }
        if (form.imagesFiles) {
          form.images = undefined;
        }
        closeModal();
        dispatcher('submit', form);
      }}>{announcement ? $LL.updateAnnouncement() : $LL.postAnnouncement()}</button
    >
    <button
      class="small text cancel-btn"
      on:click={() => {
        closeModal();
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

    .header-image {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      img {
        max-height: 20vh;
        border-radius: 4px;
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
