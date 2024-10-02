<script lang="ts">
  import { page } from '$app/stores';
  import Loading from '$lib/atoms/Loading.svelte';
  import AnnouncementEditor from '$lib/parts/AnnouncementEditor/AnnouncementEditor.svelte';

  import { genAnnouncementLoader } from '../../../../_misc/genChannelViewParams';

  const { announcementLoader } = genAnnouncementLoader();

  $: id = $page.params['id'] ?? '';
</script>

{#await announcementLoader(id)}
  <Loading />
{:then announcement}
  <AnnouncementEditor {announcement} />
{/await}
