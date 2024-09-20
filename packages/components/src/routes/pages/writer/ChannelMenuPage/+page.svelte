<script>
  import ChannelMenuPage from '$lib/pages/writer/ChannelMenuPage.svelte';

  const channel = {
    id: '9901',
    name: 'Aether Dynamics Corporation',
    icon: '/assets/logo.png',
  };
</script>

<ChannelMenuPage {channel} readerPrefix="http://localhost:5175/" />
