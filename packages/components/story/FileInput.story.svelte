<script lang="ts" context="module">
</script>

<script lang="ts">
  import FileInput from '$lib/FileInput.svelte';
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
  <FileInput bind:this={fileInput} bind:value />

  <div>
    {#if value}
      {value.name} - {value.size}bytes
    {/if}
  </div>
</Hst.Story>
