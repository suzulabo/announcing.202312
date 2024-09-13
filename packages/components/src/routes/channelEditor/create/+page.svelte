<script lang="ts">
  import ChannelEditor from '$lib/ChannelEditor.svelte';

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
>
  <div class="modal-body">
    <div>This is a modal window.</div>
    <button
      on:click={() => {
        editor.closeModal();
      }}>Close</button
    >
  </div>
</ChannelEditor>

<style lang="scss">
  .container {
    text-align: center;
    padding: 30vh;
  }

  .modal-body {
    background-color: var(--color-background);
    border-radius: 8px;
    margin: auto;
    padding: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
</style>
