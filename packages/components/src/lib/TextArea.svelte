<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';

  import LL from './i18n/i18n-svelte';

  export let name: string;
  export let label: string;
  export let placeholder = '';
  export let value = '';
  export let maxBytes = 0;
  export let error = false;
  export let maxHeight = 'none';

  let textAreaRef: HTMLTextAreaElement;

  const encoder = new TextEncoder();

  $: bytes = encoder.encode(value).length;
  $: error = maxBytes > 0 && bytes > maxBytes;

  const adjustHeight = () => {
    textAreaRef.style.height = 'auto';
    textAreaRef.style.height = `${textAreaRef.scrollHeight.toString()}px`;
  };

  onMount(() => {
    adjustHeight();
  });

  afterUpdate(() => {
    adjustHeight();
  });
</script>

<label>
  <div class="label-box">
    <span class="label">{label}</span>
    {#if maxBytes > 0 && bytes > 0}
      <div class="progress">
        <div class="bar" style={`width: ${((bytes / maxBytes) * 100).toString()}%`} />
      </div>
    {/if}
  </div>
  <textarea
    {name}
    {placeholder}
    bind:value
    bind:this={textAreaRef}
    style={`--max-height:${maxHeight}`}
  ></textarea>
  {#if error}
    <div class="error">
      {$LL.textTooLong()}
    </div>
  {/if}
</label>

<style lang="scss">
  .label-box {
    display: flex;
    align-items: center;

    .progress {
      margin-left: auto;
      height: 8px;
      width: 60px;
      border-radius: 2px;
      background-color: var(--color-background-light);
      overflow: hidden;

      .bar {
        height: 100%;
        background-color: var(--color-text);
      }
    }
  }

  textarea {
    margin-top: 4px;
    max-height: var(--max-height);
  }

  label:focus-within {
    .label {
      font-weight: 500;
    }
  }

  .error {
    margin: 4px 0 0 4px;
  }
</style>
