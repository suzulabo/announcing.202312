<script lang="ts" context="module">
  const isAnnouncement = (
    arg: Partial<GetAnnouncementResult>,
    titleError: boolean,
    bodyError: boolean,
  ): arg is GetAnnouncementResult => {
    if (titleError) {
      return false;
    }

    if (bodyError) {
      return false;
    }

    if (!arg.body) {
      return false;
    }
    return true;
  };
</script>

<script lang="ts">
  import { imgSrc } from '@announcing/components/actions/imgSrc';
  import FileInput from '@announcing/components/FileInput.svelte';
  import Input from '@announcing/components/Input.svelte';
  import TextArea from '@announcing/components/TextArea.svelte';
  import {
    ANNOUNCEMENT_BODY_MAX_BYTES,
    ANNOUNCEMENT_IMAGE_MAX_SIZE,
    ANNOUNCEMENT_TITLE_MAX_BYTES,
  } from '@announcing/db/constants';
  import type { GetAnnouncementResult } from '@announcing/db/types';
  import { LL } from '@announcing/i18n';

  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  import type { PageData } from './$types';

  export let data: PageData;

  let form: Partial<GetAnnouncementResult>;
  let titleError = false;
  let bodyError = false;
  let headerImageFileInput: FileInput;
  let imagesFileInput: FileInput;

  $: announcement = data.announcement;
  $: form = { ...announcement };
</script>

<div class="container">
  <div class="header-image">
    {#if form.headerImage}
      <button
        class="unstyled"
        on:click={() => {
          headerImageFileInput.open();
        }}
      >
        <img class="icon" alt="icon preview" use:imgSrc={form.headerImage} />
      </button>
      <button
        type="button"
        class="small"
        on:click={() => {
          form.headerImage = undefined;
        }}>{$LL.removeHeaderImage()}</button
      >
    {:else}
      <button
        class="small"
        on:click={() => {
          headerImageFileInput.open();
        }}>{$LL.chooseHeaderImage()}</button
      >
    {/if}
    <FileInput
      accept="image/jpeg,image/png,image/webp"
      maxImageSize={ANNOUNCEMENT_IMAGE_MAX_SIZE}
      bind:this={headerImageFileInput}
      bind:value={form.headerImage}
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
      {#if form.images}
        {#each form.images as image}
          <div class="img-box">
            <img alt="" use:imgSrc={image} />
            <button
              class="text"
              on:click={() => {
                form.images = form.images?.filter((v) => {
                  return v !== image;
                });
              }}>{$LL.remove()}</button
            >
          </div>
        {/each}
      {/if}
    </div>
    <button
      class="small"
      on:click={() => {
        imagesFileInput.open();
      }}
      disabled={form.images?.length === 4}>{$LL.addImage()}</button
    >
    <div class="desc">{$LL.addImageDescription()}</div>
    <FileInput
      bind:this={imagesFileInput}
      bind:values={form.images}
      accept="image/jpeg,image/png,image/webp"
      maxImageSize={ANNOUNCEMENT_IMAGE_MAX_SIZE}
      filesCount={4}
    />
  </div>

  <hr />

  <button
    disabled={!isAnnouncement(form, titleError, bodyError)}
    class="preview-btn"
    on:click={() => {
      const previewData = { ...form };
      const now = new Date().getTime();
      if (!previewData.createdAt) {
        previewData.createdAt = now;
      }
      previewData.updatedAt = now;

      if (isAnnouncement(previewData, titleError, bodyError)) {
        void goto(`${$page.url.pathname}/preview`, {
          state: {
            announcementPreviewData: previewData,
          },
        });
      }
    }}>{$LL.preview()}</button
  >
</div>

<style lang="scss">
  .container {
    padding: 16px 8px;
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
      text-align: center;
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

      .desc {
        font-size: 13px;
        font-style: italic;
        margin: 8px 0 0 0;
      }
    }

    .preview-btn {
      align-self: center;
    }
  }
</style>
