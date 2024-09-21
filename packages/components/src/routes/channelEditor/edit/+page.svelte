<script lang="ts">
  import ChannelEditor from '$lib/parts/ChannelEditor.svelte';

  let editor: ChannelEditor;

  const channel = {
    name: 'Aether Dynamics Corporation',
    desc: 'Aether Dynamics Corporation is at the forefront of cutting-edge technology, pioneering advancements in energy solutions and sustainable innovation.\nJoin us as we transform the future with dynamic, visionary science.',
    icon: '/assets/logo.png',
  };
</script>

<div class="container">
  <button
    on:click={() => {
      editor.showModal();
    }}>Show</button
  >
</div>
<ChannelEditor
  {channel}
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
