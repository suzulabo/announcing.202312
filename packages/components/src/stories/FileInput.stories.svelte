<script lang="ts" context="module">
  import { Story } from '@storybook/addon-svelte-csf';
  import type { Meta } from '@storybook/svelte';

  import { loadImage } from '$lib/actions/loadImage';
  import FileInput from '$lib/FileInput.svelte';

  export const meta = {
    title: 'FileInput',
    component: FileInput,
    tags: ['autodocs'],
  } satisfies Meta<FileInput>;
</script>

<script lang="ts">
  let fileInput: FileInput;
  let file: File | undefined;
  let filesInput: FileInput;
  let files: File[] | undefined;
</script>

<Story name="Single">
  <div class="single">
    <button
      type="button"
      on:click={() => {
        fileInput.open();
      }}>Choose image file</button
    >
    <FileInput name="file" accept="image/*" maxImageSize={200} bind:this={fileInput} bind:file />
    <img alt="" use:loadImage={file} />
  </div>
</Story>

<Story name="Multiple">
  <div class="multiple">
    <button
      type="button"
      on:click={() => {
        filesInput.open();
      }}>Choose image files</button
    >
    <FileInput
      name="file"
      accept="image/*"
      maxImageSize={200}
      bind:this={filesInput}
      bind:files
      filesCount={4}
    />
    <div class="images">
      {#each files ?? [] as f}
        <button
          class="unstyled"
          on:click={() => {
            files = files?.filter((v) => v !== f);
          }}
        >
          <img alt="" use:loadImage={f} />
        </button>
      {/each}
    </div>
  </div>
</Story>

<style lang="scss">
  .single {
    img {
      display: block;
      margin: 10px 0 0;
      max-height: 200px;
      max-width: 200px;
      object-fit: contain;
    }
  }

  .multiple {
    .images {
      margin: 10px 0 0;
      display: flex;
      gap: 10px;
      img {
        max-height: 200px;
        max-width: 200px;
        object-fit: contain;
      }
    }
  }
</style>
