<script lang="ts" context="module">
  const announcement = {
    title: 'The Art of Subtle Transformation',
    body: 'In a world driven by constant change, true mastery lies in the ability to influence without disruption. The greatest innovators understand that small, thoughtful adjustments can lead to profound shifts.\nCreativity, at its core, is about envisioning the unseen and crafting solutions that echo through time, rather than loud revolutions.\nhttps://github.com/',
    headerImage: '/assets/chicks-8782391_640x428.jpg',
    //headerImage: '/assets/cat-8575641_427x640.jpg',
    images: [
      '/assets/gecko-8483282_640x452.png',
      '/assets/background-7000157_1920x1357.jpg',
      '/assets/cat-8612685_640_small_100x150.jpg',
      '/assets/music-8559592_441x640.jpg',
    ],
    //updatedAt: new Date('2024-09-22T23:24:25'),
    updatedAt: new Date('2024-09-20T11:22:33').getTime(),
    createdAt: new Date('2024-09-20T11:22:33').getTime(),
  };
</script>

<script lang="ts">
  import { LL } from '@announcing/i18n';
  import { setupBack } from '$lib/actions/back';
  import AnnouncementView from '$lib/parts/AnnouncementView/AnnouncementView.svelte';

  const back = setupBack();
</script>

<div class="wrapper">
  <div class="container">
    <div class="header">
      <a href="../../ChannelView" use:back>{$LL.back()}</a>
    </div>
    <AnnouncementView {announcement} />
  </div>
</div>

<style lang="scss">
  .wrapper {
    background-color: var(--color-background-light);

    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: var(--color-background);

      .header {
        padding: 8px;
        margin-bottom: 16px;
        border-bottom: 1px solid var(--color-border);
      }
    }
  }
</style>
