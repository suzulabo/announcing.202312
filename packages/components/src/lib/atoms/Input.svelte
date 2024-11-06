<script lang="ts">
  import { LL } from '@announcing/i18n';

  export let name: string;
  export let label: string;
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
  </div>
  <input {name} bind:value />

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
