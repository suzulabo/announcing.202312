<script lang="ts">
  import IcBaselineRadioButtonChecked from '$lib/icons/IcBaselineRadioButtonChecked.svelte';
  import IcBaselineRadioButtonUnchecked from '$lib/icons/IcBaselineRadioButtonUnchecked.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    value?: string;
    selectedValue: string;
    children?: Snippet;
  }

  let { value = $bindable(undefined), selectedValue, children }: Props = $props();

  const click = () => {
    value = selectedValue;
  };
</script>

<button class="unstyled" onclick={click}>
  {#if value === selectedValue}
    <IcBaselineRadioButtonChecked />
  {:else}
    <IcBaselineRadioButtonUnchecked />
  {/if}
  {@render children?.()}</button
>

<style lang="scss">
  button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }
</style>
