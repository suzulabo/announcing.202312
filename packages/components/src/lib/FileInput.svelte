<script lang="ts">
  import reduce from 'image-blob-reduce';
  import { onMount } from 'svelte';
  import Loading from './Loading.svelte';

  export let name: string;
  export let file: File | null | undefined = undefined;
  export let files: File[] | null | undefined = undefined;
  export let accept: string | undefined = undefined;
  export let maxImageSize: number | undefined = undefined;
  export let filesCount = 1;

  let mounted = false;
  let fileInput: HTMLInputElement;
  let valueInput: HTMLInputElement;
  let loading = false;

  onMount(() => {
    mounted = true;
  });

  $: {
    if (mounted && 'DataTransfer' in window) {
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

  const fileHashMap = new Map<File, string>();

  const getFileHash = async (file: File) => {
    const c = fileHashMap.get(file);

    if (c) return c;

    const arrayBuffer = await file.arrayBuffer();

    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);

    const h = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));

    fileHashMap.set(file, h);

    return h;
  };

  const fileInputChange = async () => {
    const selectedFiles = fileInput.files;

    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }

    const newFiles: File[] = files ? [...files] : [];

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
        const m = new Map<string, File>();

        for (const f of newFiles) {
          const h = await getFileHash(f);

          if (!m.has(h)) {
            m.set(h, f);
          }
        }

        files = [...m.values()];
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
