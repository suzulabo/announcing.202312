<script lang="ts">
  import reduce from 'image-blob-reduce';

  import { saveBlob } from '$lib/utils/idbBlob';

  import Loading from './Loading.svelte';

  interface Props {
    value?: string | undefined;
    values?: string[] | undefined;
    accept?: string | undefined;
    maxImageSize?: number | undefined;
    filesCount?: number;
  }

  let {
    value = $bindable(undefined),
    values = $bindable(undefined),
    accept = undefined,
    maxImageSize = undefined,
    filesCount = 1,
  }: Props = $props();

  let loading = $state(false);
  let fileInput: HTMLInputElement;

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
  onchange={fileInputChange}
/>

{#if loading}
  <Loading show={true} />
{/if}
