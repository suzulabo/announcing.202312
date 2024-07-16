<script context="module">
  export const meta = {
    title: 'base/button',
    tags: ['autodocs'],
  };
</script>

<script lang="ts">
  import { Story } from '@storybook/addon-svelte-csf';
</script>

<Story name="Normal">
  <button>Button</button>
</Story>

<Story name="Anchor">
  <a class="button" href="https://github.com">Github</a>
</Story>

<Story name="Disabled">
  <button disabled>Disabled</button>
</Story>
