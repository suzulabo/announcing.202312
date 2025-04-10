<script lang="ts">
  import SettingsModal from '$lib/parts/SettingsModal/SettingsModal.svelte';
  import { type Locales } from '@announcing/i18n';

  let locale = $state<Locales>('ja');
  let theme = $state('light');

  let settingsModal: SettingsModal;
</script>

<button
  onclick={() => {
    settingsModal.openModal();
  }}>Show</button
>

<SettingsModal
  bind:this={settingsModal}
  bind:locale
  bind:theme
  onSignOut={() => {
    alert('sign out');
  }}
/>

<style lang="scss">
  button {
    display: block;
    margin: auto;
  }
</style>
