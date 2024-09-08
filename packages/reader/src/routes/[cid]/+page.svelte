<script lang="ts">
  import ChannelPage, { type ChannelPageParams } from '@announcing/components/ChannelPage.svelte';

  import type { PageServerData } from './$types';

  export let data: PageServerData;

  const toPageParams = (): ChannelPageParams => {
    const c = data.channel;
    const channel: ChannelPageParams['channel'] = {
      title: c.title,
      desc: c.desc,
      icon: c.icon && `/s/${c.icon}`,
      links: c.links,
    };

    const segments: ChannelPageParams['segments'] = c.announcements
      ? [{ key: 'newest', count: c.announcements.length }]
      : [];

    const loader: ChannelPageParams['loader'] = (key: string) => {
      if (key === 'newest') {
        const a = c.announcements ?? [];

        const result = a.map((v) => {
          return {
            id: v.id,
            headerImage: v.headerImage && `/s/${v.headerImage}`,
            title: v.title,
            body: v.body,
            images: v.images?.map((v) => `/s/${v}`),
            links: v.links,
            updatedAt: new Date(v.updatedAt),
            createdAt: new Date(v.createdAt),
          };
        });

        return Promise.resolve(result);
      }

      throw new Error(`Unexpected key: ${key}`);
    };

    const settingsClick = () => {
      // TODO
    };

    return { viewName: 'default', channel, segments, loader, settingsClick };
  };

  $: params = toPageParams();
</script>

<ChannelPage {params} />
