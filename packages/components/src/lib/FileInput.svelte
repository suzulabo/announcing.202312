<script lang="ts">
  export let value: File;
  export let accept: string | undefined = undefined;

  let fileInput: HTMLInputElement;

  export const open = () => {
    fileInput.click();
  };
</script>

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
  }}
/>
