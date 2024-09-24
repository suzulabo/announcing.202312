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
    updatedAt: new Date('2024-09-20T11:22:33'),
    createdAt: new Date('2024-09-20T11:22:33'),
  };
</script>

<script lang="ts">
  import DefaultAnnouncementView from '$lib/parts/AnnouncementView/default/DefaultAnnouncementView.svelte';
</script>

<DefaultAnnouncementView {announcement} />
