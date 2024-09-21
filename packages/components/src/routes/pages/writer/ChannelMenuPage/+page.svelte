<script>
  import ChannelMenuPage from '$lib/pages/writer/ChannelMenuPage/ChannelMenuPage.svelte';

  let channel = {
    id: '9901',
    name: 'Aether Dynamics Corporation',
    desc: 'Aether Dynamics Corporation is at the forefront of cutting-edge technology, pioneering advancements in energy solutions and sustainable innovation.\nJoin us as we transform the future with dynamic, visionary science.',
    icon: '/assets/logo.png',
  };
</script>

<ChannelMenuPage
  {channel}
  readerPrefix="http://localhost:5175/"
  updateChannelSubmit={(updated) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        channel = updated;
        resolve();
      }, 1000);
    });
  }}
  deleteChannelClick={() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }}
/>
