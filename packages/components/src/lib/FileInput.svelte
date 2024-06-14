<script lang="ts">
  import reduce from 'image-blob-reduce';
  import Loading from './Loading.svelte';

  export let name: string;
  export let file: File | null | undefined = undefined;
  export let files: File[] | null | undefined = undefined;
  export let accept: string | undefined = undefined;
  export let maxImageSize: number | undefined = undefined;
  export let filesCount: number = 1;

  let fileInput: HTMLInputElement;
  let valueInput: HTMLInputElement;
  let loading = false;

  $: {
    if (valueInput && 'DataTransfer' in window) {
      const a = file ? [file] : files ?? [];

      if (a.length === 0) {
        valueInput.value = '';
      } else {
        const dt = new DataTransfer();

        a.forEach((v) => dt.items.add(v));
        valueInput.files = dt.files;
      }
    }
  }

  export const open = () => {
    fileInput.click();
  };

  const fileInputChange = async () => {
    const selectedFiles = fileInput.files;

    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }

    const newFiles: File[] = [];

    loading = true;

    try {
      for (let i = 0; i < filesCount; i++) {
        const f = selectedFiles.item(i);

        if (!f) break;

        if (!maxImageSize) {
          newFiles.push(f);

          continue;
        }

        const reducer = reduce();

        const reduced = await reducer.toBlob(f, {
          max: maxImageSize,
          unsharpAmount: 160,
          unsharpRadius: 0.6,
          unsharpThreshold: 1,
        });

        newFiles.push(new File([reduced], f.name, { type: reduced.type }));
      }

      if (filesCount > 1) {
        files = newFiles;
      } else {
        file = newFiles[0];
      }

      fileInput.value = '';
    } finally {
      loading = false;
    }
  };
</script>

<input type="file" style="display:none" {name} bind:this={valueInput} multiple={filesCount > 1} />

<input
  type="file"
  {accept}
  multiple={filesCount > 1}
  style="display:none"
  bind:this={fileInput}
  on:change={fileInputChange}
/>

{#if loading}
  <Loading show={true} />
{/if}
