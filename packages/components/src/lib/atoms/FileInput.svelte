<script lang="ts">
  import reduce from 'image-blob-reduce';

  import { saveBlob } from '$lib/utils/idbBlob';

  import Loading from './Loading.svelte';

  export let value: string | undefined = undefined;
  export let values: string[] | undefined = undefined;
  export let accept: string | undefined = undefined;
  export let maxImageSize: number | undefined = undefined;
  export let filesCount = 1;

  let fileInput: HTMLInputElement;
  let loading = false;

  export const open = () => {
    fileInput.click();
  };

  const fileInputChange = async () => {
    const selectedFiles = fileInput.files;

    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }

    const newValues = new Set(values);

    loading = true;

    try {
      for (let i = 0; i < filesCount; i++) {
        const f = selectedFiles.item(i);

        if (!f) break;

        if (!maxImageSize) {
          const id = await saveBlob(f);
          newValues.add(id);
          continue;
        }

        const reducer = reduce();

        const reduced = await reducer.toBlob(f, {
          max: maxImageSize,
          unsharpAmount: 160,
          unsharpRadius: 0.6,
          unsharpThreshold: 1,
        });

        newValues.add(await saveBlob(reduced));
      }

      if (filesCount > 1) {
        values = [...newValues.values()].slice(0, filesCount);
      } else {
        value = newValues.values().next().value;
      }

      fileInput.value = '';
    } finally {
      loading = false;
    }
  };
</script>

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
