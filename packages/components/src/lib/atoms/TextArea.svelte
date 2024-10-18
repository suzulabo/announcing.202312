<script lang="ts">
  import { LL } from '@announcing/i18n';
  import { afterUpdate, onMount } from 'svelte';

  export let name: string;
  export let label: string;
  export let placeholder = '';
  export let value: string | undefined = undefined;
  export let maxBytes = 0;
  export let error = false;
  export let maxHeight = 'none';
  export let required = false;

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
    {#if required}
      <span class="required">{$LL.required()}</span>
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
  label {
    display: flex;
    flex-direction: column;
  }
  .label-box {
    display: flex;
    align-items: center;

    .required {
      font-size: 12px;
      color: var(--color-text-light);
      margin: 0 0 0 4px;
    }
  }

  textarea {
    margin-top: 4px;
    max-height: var(--max-height);
  }

  label:focus-within {
    .label,
    .required {
      font-weight: 500;
    }
  }

  .error {
    margin: 4px 0 0 4px;
  }
</style>
