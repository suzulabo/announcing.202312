<script lang="ts" context="module">
</script>

<script lang="ts">
  import FileInput from '$lib/FileInput.svelte';
  import { loadImage } from '$lib/actions/loadImage.js';
  import type { Hst } from '@histoire/plugin-svelte';

  // eslint-disable-next-line no-import-assign
  export let Hst: Hst;

  let fileInput: FileInput;
  let file: File | undefined;
</script>

<Hst.Story title="FileInput">
  <button
    on:click={() => {
      fileInput.open();
    }}>Choose image file</button
  >
  <FileInput name="file" accept="image/*" maxImageSize={200} bind:this={fileInput} bind:file />

  <img alt="" use:loadImage={file} />

  {#if file}
    <button
      on:click={() => {
        fileInput.remove();
      }}>Remove image</button
    >
  {/if}
</Hst.Story>
