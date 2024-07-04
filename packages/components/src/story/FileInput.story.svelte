<script lang="ts" context="module">
</script>

<script lang="ts">
  import type { Hst } from '@histoire/plugin-svelte';

  import { loadImage } from '$lib/actions/loadImage.js';
  import FileInput from '$lib/FileInput.svelte';

  // eslint-disable-next-line no-import-assign
  export let Hst: Hst;

  let fileInput: FileInput;
  let file: File | undefined;
  let filesInput: FileInput;
  let files: File[] | undefined;
  let form: HTMLFormElement;
</script>

<Hst.Story title="FileInput">
  <form id="form" action="." method="POST" enctype="multipart/form-data" bind:this={form}>
    <button
      type="button"
      on:click={() => {
        const data = new FormData(form);

        console.log('file', data.getAll('file'));
        console.log('files', data.getAll('files'));
      }}>Check form values</button
    >
    <hr />
    <button
      type="button"
      on:click={() => {
        console.log({ fileInput });
        fileInput.open();
      }}>Choose image file</button
    >
    <FileInput name="file" accept="image/*" maxImageSize={200} bind:this={fileInput} bind:file />

    <img alt="" use:loadImage={file} />

    {#if file}
      <button
        type="button"
        on:click={() => {
          file = undefined;
        }}>Remove image</button
      >
    {/if}

    <hr />
    <button
      type="button"
      on:click={() => {
        filesInput.open();
      }}>Choose image files</button
    >
    <FileInput
      name="files"
      accept="image/*"
      maxImageSize={200}
      bind:this={filesInput}
      bind:files
      filesCount={4}
    />

    {#each files ?? [] as f}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <img
        alt=""
        use:loadImage={f}
        on:click={() => {
          files = files?.filter(v => v !== f);
        }}
      />
    {/each}

    {#if files}
      <button
        type="button"
        on:click={() => {
          files = undefined;
        }}>Remove images</button
      >
    {/if}
  </form>
</Hst.Story>

<style lang="scss">
  hr {
    margin: 20px 0;
  }
</style>
