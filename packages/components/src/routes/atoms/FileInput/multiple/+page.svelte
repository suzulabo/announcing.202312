<script lang="ts">
  import { imgSrc } from '$lib/actions/imgSrc';
  import FileInput from '$lib/atoms/FileInput.svelte';

  let fileInput: FileInput;
  let values: string[] | undefined;
</script>

<div class="container">
  <button
    on:click={() => {
      fileInput.open();
    }}>Open</button
  >

  <FileInput bind:this={fileInput} bind:values accept="*/image" filesCount={4} />

  {#if values}
    <div class="images">
      {#each values as value}
        <button
          class="unstyled"
          on:click={() => {
            values = values?.filter((v) => v !== value);
          }}
        >
          <img alt="" use:imgSrc={value} />
        </button>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  .container {
    text-align: center;
    padding: 30vh;

    .images {
      margin: 20px 0;
      display: flex;
      gap: 16px;
      justify-content: center;
      img {
        max-height: 100px;
      }
    }
  }
</style>
