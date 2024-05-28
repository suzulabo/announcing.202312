<script lang="ts">
  import reduce from 'image-blob-reduce';
  import Loading from './Loading.svelte';

  export let name: string;
  export let value: File | undefined = undefined;
  export let accept: string | undefined = undefined;
  export let maxImageSize: number | undefined = undefined;

  let fileInput: HTMLInputElement;
  let valueInput: HTMLInputElement;
  let loading = false;

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

    if (!maxImageSize) {
      value = file;

      const dt = new DataTransfer();

      dt.items.add(file);
      valueInput.files = dt.files;

      return;
    }

    loading = true;

    const reducer = reduce();

    reducer
      .toBlob(file, {
        max: maxImageSize,
        unsharpAmount: 160,
        unsharpRadius: 0.6,
        unsharpThreshold: 1,
      })
      .then((v) => {
        value = new File([v], file.name, { type: v.type });

        const dt = new DataTransfer();

        dt.items.add(value);
        valueInput.files = dt.files;
      })
      .finally(() => {
        loading = false;
      });
  }}
/>

{#if loading}
  <Loading show={true} />
{/if}
