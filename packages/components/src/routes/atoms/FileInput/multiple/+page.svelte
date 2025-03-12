<script lang='ts'>
  import { imgSrc } from '$lib/actions/imgSrc'
  import FileInput from '$lib/atoms/FileInput.svelte'

  let fileInput = $state<ReturnType<typeof FileInput>>()
  let values: string[] | undefined = $state()
</script>

<div class='container'>
  <button
    onclick={() => {
      fileInput?.open()
    }}>Open</button
  >

  <FileInput bind:this={fileInput} bind:values accept='*/image' filesCount={4} />

  {#if values}
    <div class='images'>
      {#each values as value}
        <button
          class='unstyled'
          onclick={() => {
            values = values?.filter(v => v !== value)
          }}
        >
          <img alt="" use:imgSrc={value} />
        </button>
      {/each}
    </div>
  {/if}
</div>

<style lang='scss'>
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
