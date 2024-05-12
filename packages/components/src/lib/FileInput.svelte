<script lang="ts">
  export let name: string;
  export let value: File | undefined = undefined;
  export let accept: string | undefined = undefined;

  let fileInput: HTMLInputElement;
  let valueInput: HTMLInputElement;

  export const open = () => {
    fileInput.click();
  };
</script>

<input type="file" style="display:none" {name} bind:this={valueInput} />

<input
  type="file"
  {accept}
  style="display:none"
  bind:this={fileInput}
  on:change={() => {
    if (!fileInput.files) {
      return;
    }

    const file = fileInput.files[0];

    if (!file) {
      return;
    }

    value = file;

    const dt = new DataTransfer();

    dt.items.add(file);
    valueInput.files = dt.files;
  }}
/>
