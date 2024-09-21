<script lang="ts">
  import ChannelEditor from '$lib/parts/ChannelEditor.svelte';

  let editor: ChannelEditor;
</script>

<div class="container">
  <button
    on:click={() => {
      editor.showModal();
    }}>Show</button
  >
</div>
<ChannelEditor
  bind:this={editor}
  on:submit={({ detail }) => {
    console.log(detail);
  }}
/>

<style lang="scss">
  .container {
    text-align: center;
    padding: 30vh 0;
  }
</style>
