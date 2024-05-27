<script lang="ts" context="module">
</script>

<script lang="ts">
  import FileInput from '$lib/FileInput.svelte';
  import loadImage from '$lib/actions/loadImage.js';
  import type { Hst } from '@histoire/plugin-svelte';

  // eslint-disable-next-line no-import-assign
  export let Hst: Hst;

  let fileInput: FileInput;
  let value: File | undefined;
</script>

<Hst.Story title="FileInput">
  <button
    on:click={() => {
      fileInput.open();
    }}>Choose Image File</button
  >
  <FileInput name="file" accept="image/*" maxImageSize={200} bind:this={fileInput} bind:value />

  <img alt="" use:loadImage={value} />
</Hst.Story>
