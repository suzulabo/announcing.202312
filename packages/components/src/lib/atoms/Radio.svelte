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

<button class="radio unstyled" onclick={click}>
  {#if value === selectedValue}
    <IcBaselineRadioButtonChecked />
  {:else}
    <IcBaselineRadioButtonUnchecked />
  {/if}
  <div>{@render children?.()}</div></button
>

<style lang="scss">
  button.radio {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
  }
</style>
