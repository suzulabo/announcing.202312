<script lang="ts">
  import { imgSrc } from '$lib/actions/imgSrc';
  import FileInput from '$lib/atoms/FileInput.svelte';

  let fileInput = $state<ReturnType<typeof FileInput>>();

  let value: string | undefined = $state();
</script>

<div class="container">
  <button
    onclick={() => {
      fileInput?.open();
    }}>Open</button
  >

  <FileInput bind:this={fileInput} bind:value accept="*/image" />

  {#if value}
    <div>
      <img alt="" use:imgSrc={value} />
    </div>
    <div>
      {value}
    </div>
  {/if}
</div>

<style lang="scss">
  .container {
    text-align: center;
    padding: 30vh;

    img {
      margin: 20px 0;
    }
  }
</style>
