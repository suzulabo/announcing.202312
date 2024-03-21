<script lang="ts">
  import { afterUpdate } from 'svelte';

  export let label: string;
  export let value = '';

  let textAreaRef: HTMLTextAreaElement;

  afterUpdate(() => {
    textAreaRef.style.height = 'auto';
    textAreaRef.style.height = textAreaRef.scrollHeight + 'px';
  });
</script>

<label
  ><span>{label}</span>
  <textarea bind:this={textAreaRef} bind:value></textarea>
</label>

<style lang="scss">
  label:focus-within {
    span {
      font-weight: 500;
    }
  }

  textarea {
    margin-top: 4px;
  }
</style>
