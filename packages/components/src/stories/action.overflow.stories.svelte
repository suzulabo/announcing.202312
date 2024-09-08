<script context="module">
  import { Story } from '@storybook/addon-svelte-csf';

  import { overflow } from '$lib/actions/overflow';

  export const meta = {
    title: 'action/overflow',
    tags: ['autodocs'],
  };
</script>

<Story name="Basic">
  <div class="basic-box">
    <div class="body overflowing-y" use:overflow>
      In the beginning God created the heavens and the earth. Now the earth was formless and empty,
      darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.
      And God said, 'Let there be light,' and there was light. God saw that the light was good, and
      he separated the light from the darkness. God called the light 'day,' and the darkness he
      called 'night.
    </div>
  </div>
</Story>

<style lang="scss">
  .basic-box {
    width: 100%;
    height: 100px;
    border-radius: 8px;
    border: 1px solid var(--color-border);
    padding: 8px;
    overflow: hidden;
    .body {
      overflow: hidden;
      height: 100%;
      position: relative;
      &.overflowing-y:after {
        position: absolute;
        bottom: 0;
        top: 0;
        left: 0;
        right: 0;
        content: '';
        background: linear-gradient(
          to top,
          rgba(var(--color-background-rgb), 1),
          rgba(var(--color-text-rgb), 0) 50%
        );
        pointer-events: none;
      }
    }
  }
</style>
