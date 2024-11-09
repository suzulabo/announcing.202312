<script lang="ts" module>
  const announcement = {
    body: 'In a world driven by constant change, true mastery lies in the ability to influence without disruption. The greatest innovators understand that small, thoughtful adjustments can lead to profound shifts.\nCreativity, at its core, is about envisioning the unseen and crafting solutions that echo through time, rather than loud revolutions.\nhttps://github.com/',
    images: [
      '/assets/gecko-8483282_640x452.png',
      //'/assets/cat-8612685_640_small_100x150.jpg',
    ],
    updatedAt: new Date('2024-09-20T11:22:33').getTime(),
    createdAt: new Date('2024-09-20T11:22:33').getTime(),
  };
</script>

<script lang="ts">
  import DefaultAnnouncementView from '$lib/parts/AnnouncementView/default/DefaultAnnouncementView.svelte';
</script>

<DefaultAnnouncementView {announcement} />
