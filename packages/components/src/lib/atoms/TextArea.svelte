<script lang="ts">
  import { LL } from '@announcing/i18n';
  import autosize from 'autosize';

  interface Props {
    name: string;
    label: string;
    placeholder?: string;
    value?: string | undefined;
    maxBytes?: number;
    error?: boolean;
    maxHeight?: string;
    required?: boolean;
  }

  let {
    name,
    label,
    placeholder = '',
    value = $bindable(undefined),
    maxBytes = 0,
    error = $bindable(false),
    maxHeight = 'none',
    required = false,
  }: Props = $props();

  const encoder = new TextEncoder();

  let bytes = $derived(encoder.encode(value).length);
  $effect(() => {
    error = maxBytes > 0 && bytes > maxBytes;
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const autoSizeAction = (el: Element, _: string | undefined) => {
    autosize(el);

    return {
      // When the value is updated from the parent component, the height is not updated, so it will be updated here.
      update: () => {
        autosize.update(el);
      },
    };
  };
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
    style={`--max-height:${maxHeight}`}
    use:autoSizeAction={value}
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
