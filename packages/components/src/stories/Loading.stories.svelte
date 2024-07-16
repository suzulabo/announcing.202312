<script lang="ts" context="module">
  import { Story } from '@storybook/addon-svelte-csf';
  import type { Meta } from '@storybook/svelte';

  import Loading from '$lib/Loading.svelte';

  export const meta = {
    title: 'Loading',
    component: Loading,
    tags: ['autodocs'],
  } satisfies Meta<Loading>;
</script>

<Story name="Basic">
  <Loading show={true} />
</Story>
