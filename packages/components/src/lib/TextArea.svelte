<script lang="ts">
  import { afterUpdate } from 'svelte';

  export let name: string;
  export let label: string;
  export let placeholder = '';
  export let value = '';
  export let maxLength = 0;

  let textAreaRef: HTMLTextAreaElement;

  afterUpdate(() => {
    textAreaRef.style.height = 'auto';
    textAreaRef.style.height = textAreaRef.scrollHeight + 'px';
  });
</script>

<label>
  <div class="label-box">
    <span class="label">{label}</span>
    {#if maxLength > 0}
      <span class="counter">({value.length}/{maxLength})</span>
    {/if}
  </div>
  <textarea
    {name}
    {placeholder}
    bind:value
    maxLength={maxLength || undefined}
    bind:this={textAreaRef}
  ></textarea>
</label>

<style lang="scss">
  .label-box {
    display: flex;
    .counter {
      visibility: hidden;
      margin-left: auto;
    }
  }

  textarea {
    margin-top: 4px;
  }

  label:focus-within {
    .label {
      font-weight: 500;
    }
    .counter {
      visibility: visible;
    }
  }
</style>
