<script lang="ts">
  import reduce from 'image-blob-reduce';

  import { getBlobHash } from '$lib/utils/getBlobHash';
  import Loading from './Loading.svelte';

  interface Props {
    accept?: string | undefined;
    maxImageSize?: number | undefined;
    filesCount?: number;
    onInput?: (blob: Blob, hash: string) => void | Promise<void>;
    onInputs?: (inputs: [string, Blob][]) => void | Promise<void>;
  }

  let {
    accept = undefined,
    maxImageSize = undefined,
    filesCount = 1,
    onInput,
    onInputs,
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

    loading = true;

    const filesMap = new Map<string, Blob>();

    try {
      for (let i = 0; i < filesCount; i++) {
        const f = selectedFiles.item(i);

        if (!f) break;

        const hash = await getBlobHash(f);

        if (!maxImageSize) {
          filesMap.set(hash, f);
          continue;
        }

        const reducer = reduce();

        const reduced = await reducer.toBlob(f, {
          max: maxImageSize,
          unsharpAmount: 160,
          unsharpRadius: 0.6,
          unsharpThreshold: 1,
        });

        filesMap.set(hash, reduced);
      }

      if (filesCount === 1 && onInput) {
        const entry = filesMap.entries().next().value;
        if (entry) {
          await onInput(entry[1], entry[0]);
        }
      } else if (onInputs) {
        const inputs = [...filesMap.entries()];
        if (inputs.length > 0) {
          await onInputs(inputs);
        }
      }
    } finally {
      fileInput.value = '';
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
