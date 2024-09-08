<script lang="ts" context="module">
  import { faker } from '@faker-js/faker';
  import { Story } from '@storybook/addon-svelte-csf';
  import type { Meta } from '@storybook/svelte';

  import VirtualScrollGrid from '$lib/VirtualScrollGrid.svelte';

  export const meta = {
    title: 'VirtualScrollGrid',
    component: VirtualScrollGrid,
    tags: ['autodocs', 'wait-.items'],
    parameters: {
      //layout: 'fullscreen',
    },
  } satisfies Meta<VirtualScrollGrid<unknown>>;

  let num = 100;

  const genData = (len: number) => {
    const result = [];

    faker.seed(1192);

    for (let i = 0; i < len; i++) {
      const id = (num++).toString();
      const title = `[${id}] ${faker.lorem.sentence()}`;
      const body = faker.lorem.text();
      result.push({ id, title, body });
    }

    return result;
  };
</script>

<script lang="ts">
</script>

<Story name="Basic">
  <VirtualScrollGrid items={genData(100)} itemHeight={100} itemMinWidth={300} gap={10}>
    <!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
    <div class="basic-item" slot="item" let:item>
      <div>{item.title}</div>
      <div class="body">{item.body}</div>
    </div>
  </VirtualScrollGrid>
</Story>

<style lang="scss">
  .basic-item {
    height: 100%;
    padding: 8px;
    border-radius: 4px;
    background-color: silver;
    display: flex;
    flex-direction: column;
    .body {
      flex-grow: 1;
      margin: 8px 0 0 0;
      overflow: hidden;
    }
  }
</style>
