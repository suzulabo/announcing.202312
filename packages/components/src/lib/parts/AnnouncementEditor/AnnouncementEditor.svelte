<script lang="ts" context="module">
  export type Announcement = {
    headerImageFile?: File | undefined;
    title?: string | undefined;
    body: string;
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
  import TextArea from '$lib/atoms/TextArea.svelte';
  import {
    ANNOUNCEMENT_BODY_MAX_BYTES,
    ANNOUNCEMENT_IMAGE_MAX_SIZE,
    ANNOUNCEMENT_TITLE_MAX_BYTES,
  } from '$lib/constants';
  import { LL } from '$lib/i18n';

  export let announcement: Announcement | undefined = undefined;
  export let backURL: string;

  const dispatcher = createEventDispatcher<{ submit: Partial<Announcement>; cancel: undefined }>();

  let form: Partial<Announcement>;
  let titleError = false;
  let bodyError = false;
  let headerImageFileInput: FileInput;
  let imagesFileInput: FileInput;

  $: form = { ...announcement };
  $: validated = !!form.body && !titleError && !bodyError;
</script>

<div class="container">
  <div class="header">
    <a href={backURL}>{$LL.back()}</a>
  </div>
  <div class="header-image">
    {#if form.headerImageFile}
      <button
        class="unstyled"
        on:click={() => {
          headerImageFileInput.open();
        }}
      >
        {#if form.headerImageFile}
          <img class="icon" alt="icon preview" use:loadImage={form.headerImageFile} />
        {/if}
      </button>
      <button
        type="button"
        class="small"
        on:click={() => {
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
      maxImageSize={ANNOUNCEMENT_IMAGE_MAX_SIZE}
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
  <div class="images-box">
    <div class="images">
      {#if form.imagesFiles}
        {#each form.imagesFiles as image}
          <div class="img-box">
            <img alt="" use:loadImage={image} />
            <button
              class="text"
              on:click={() => {
                form.imagesFiles = form.imagesFiles?.filter((v) => {
                  return v !== image;
                });
              }}>{$LL.remove()}</button
            >
          </div>
        {/each}
      {/if}
    </div>
    <button
      on:click={() => {
        imagesFileInput.open();
      }}
      disabled={form.imagesFiles?.length === 4}>{$LL.addImage()}</button
    >
    <div class="desc">{$LL.addImageDescription()}</div>
    <FileInput
      bind:this={imagesFileInput}
      bind:files={form.imagesFiles}
      name="images"
      accept="image/jpeg,image/png,image/webp"
      maxImageSize={ANNOUNCEMENT_IMAGE_MAX_SIZE}
      filesCount={4}
    />
  </div>

  <hr />

  <button
    disabled={!validated}
    class="submit-btn"
    on:click={() => {
      dispatcher('submit', form);
    }}>{announcement ? $LL.updateAnnouncement() : $LL.postAnnouncement()}</button
  >
</div>

<style lang="scss">
  .container {
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

    .images-box {
      .images {
        display: grid;
        gap: 8px;
        grid-template-columns: repeat(auto-fit, minmax(140px, auto));
        margin: 0 0 16px;
        .img-box {
          display: flex;
          flex-direction: column;
          img {
            margin: auto;
            max-height: 140px;
            object-fit: contain;
            border-radius: 4px;
          }
          button {
            width: fit-content;
            margin: 4px auto 0;
          }
        }
      }

      text-align: center;
      .desc {
        font-size: 13px;
        font-style: italic;
        margin: 4px 0 0 0;
      }
    }

    .submit-btn {
      align-self: center;
    }
  }
</style>
