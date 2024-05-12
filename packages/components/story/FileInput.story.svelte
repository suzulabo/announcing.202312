<script lang="ts" context="module">
</script>

<script lang="ts">
  import FileInput from '$lib/FileInput.svelte';
  import Image from '$lib/Image.svelte';
  import type { Hst } from '@histoire/plugin-svelte';

  // eslint-disable-next-line no-import-assign
  export let Hst: Hst;

  let fileInput: FileInput;
  let value: File;
</script>

<Hst.Story title="FileInput">
  <button
    on:click={() => {
      fileInput.open();
    }}>Choose File</button
  >
  <FileInput name="file" accept="image/*" bind:this={fileInput} bind:value />

  <div style="margin-top: 20px">
    {#if value}
      <Image
        src={value}
        --width="200px"
        --height="200px"
        on:click={() => {
          fileInput.open();
        }}
      />
    {/if}
  </div>
</Hst.Story>
