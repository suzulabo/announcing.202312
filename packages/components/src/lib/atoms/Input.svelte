<script lang="ts">
  import LL from '$lib/i18n/i18n-svelte';

  export let name: string;
  export let label: string;
  export let placeholder = '';
  export let value: string | undefined = undefined;
  export let maxBytes = 0;
  export let error = false;
  export let required = false;

  const encoder = new TextEncoder();

  $: bytes = encoder.encode(value).length;
  $: error = maxBytes > 0 && bytes > maxBytes;
</script>

<label>
  <div class="label-box">
    <span class="label">{label}</span>
    {#if required}
      <span class="required">{$LL.required()}</span>
    {/if}
    {#if maxBytes > 0 && bytes > 0}
      <div class="progress">
        <div class="bar" style={`width: ${((bytes / maxBytes) * 100).toString()}%`} />
      </div>
    {/if}
  </div>
  <input {name} {placeholder} bind:value />

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

    .required {
      font-size: 12px;
      color: var(--color-text-light);
      margin: 0 0 0 4px;
    }

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

  input {
    margin-top: 4px;
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
