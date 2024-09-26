<script lang="ts">
  import { onMount } from 'svelte';

  onMount(async () => {
    console.log('beforeUpdate');
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    console.log('endUpdate');
  });
</script>

<div class="title">Announcing components</div>
<hr />

<ul class="links">
  <li><a href="./modal">Modal</a></li>
  <li><a href="./channelEditor/create">ChannelEditor - create</a></li>
  <li><a href="./channelEditor/edit">ChannelEditor - edit</a></li>
  <li><a href="./parts/AnnouncementEditor/create">AnnouncementEditor - create</a></li>
  <li><a href="./parts/AnnouncementView/default">AnnouncementView - default</a></li>
  <li>
    <a href="./parts/AnnouncementView/default/singleImage">AnnouncementView - single image</a>
  </li>
  <li><a href="./nav/10">Navigation</a></li>
  <li><a href="./pages/writer/ChannelMenuPage">ChannelMenuPage</a></li>
  <li><a href="./pages/writer/AnnouncementEditorPage">AnnouncementEditorPage</a></li>
</ul>

<style lang="scss">
  .title {
    margin: 10px 0 0;
    text-align: center;
    font-size: 20px;
  }
  hr {
    margin: 20px 0;
  }
  .links {
    width: fit-content;
    max-width: 600px;
    margin: 0 auto;
    list-style: inside;
    li {
      margin: 12px 0;
    }
  }
</style>
