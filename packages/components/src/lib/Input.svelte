<script lang="ts">
  export let name: string;
  export let label: string;
  export let type = 'text';
  export let placeholder = '';
  export let value: string | null | undefined = undefined;
  export let maxLength = 0;
</script>

<label>
  <div class="label-box">
    <span class="label">{label}</span>
    {#if maxLength > 0}
      <span class="counter">({value?.length ?? '0'}/{maxLength})</span>
    {/if}
  </div>
  <input
    {name}
    {type}
    {placeholder}
    {value}
    maxLength={maxLength || undefined}
    on:input={(e) => {
      value = e.currentTarget.value;
    }}
  />
</label>

<style lang="scss">
  .label-box {
    display: flex;
    .counter {
      visibility: hidden;
      margin-left: auto;
    }
  }

  input {
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
