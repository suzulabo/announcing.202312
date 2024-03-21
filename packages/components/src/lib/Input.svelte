<script lang="ts">
  export let label: string;
  export let type = 'text';
  export let value = '';
</script>

<label
  ><span>{label}</span>
  <input {type} {value} />
</label>

<style lang="scss">
  label:focus-within {
    span {
      font-weight: 500;
    }
  }

  input {
    margin-top: 4px;
  }
</style>
