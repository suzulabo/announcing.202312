<script lang="ts">
  export let name: string;
  export let value: string;
  export let accept: string = '';

  let fileInput: HTMLInputElement;
  let hiddenInput: HTMLInputElement;

  export const open = () => {
    fileInput.click();
  };
</script>

<input type="hidden" bind:this={hiddenInput} {name} {value} />
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

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === 'string') {
        value = result;
      }
    };

    reader.readAsDataURL(file);
  }}
/>
