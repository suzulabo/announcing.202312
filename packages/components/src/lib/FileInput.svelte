<script lang="ts">
  import reduce from 'image-blob-reduce';
  import Loading from './Loading.svelte';

  export let name: string;
  export let file: File | null | undefined = undefined;
  export let files: File[] | null | undefined = undefined;
  export let removed: boolean = false;
  export let accept: string | undefined = undefined;
  export let maxImageSize: number | undefined = undefined;
  export let filesCount: number = 1;

  let fileInput: HTMLInputElement;
  let valueInput: HTMLInputElement;
  let removedInput: HTMLInputElement;
  let loading = false;

  export const open = () => {
    fileInput.click();
  };
  export const remove = () => {
    removedInput.value = 'true';
    removed = true;
    file = undefined;
    files = undefined;
  };

  const fileInputChange = async () => {
    const selectedFiles = fileInput.files;

    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }

    const newFiles: File[] = [];

    loading = true;

    try {
      for (const f of selectedFiles) {
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

      const dt = new DataTransfer();

      newFiles.forEach((v) => dt.items.add(v));
      valueInput.files = dt.files;

      if (filesCount > 1) {
        files = newFiles;
      } else {
        file = newFiles[0];
      }

      fileInput.value = '';
      removed = false;
    } finally {
      loading = false;
    }
  };
</script>

<input type="file" style="display:none" {name} bind:this={valueInput} multiple={filesCount > 1} />
<input
  type="hidden"
  name={`${name}Removed`}
  bind:this={removedInput}
  value={removed ? 'true' : ''}
/>

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
