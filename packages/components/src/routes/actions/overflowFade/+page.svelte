<script lang="ts">
  import { overflowFade } from '$lib/actions/overflowFade';

  let small = true;
  let openReadMore = false;
</script>

<div class="container">
  <button
    on:click={() => {
      small = !small;
      openReadMore = false;
    }}>{small ? 'normal' : 'small'}</button
  >
  <div class="wrapper" class:small>
    <div class="overflow-fade" use:overflowFade>
      Announcing is the world’s most boring web service, by design. Unlike traditional social media
      platforms, it strips away all the noise—there are no likes, comments, shares, or user
      interactions. It’s a space free from the clutter of social engagement, allowing you to focus
      solely on the content you care about. Essentially, Announcing is a stripped-down version of a
      social media platform, where RSS feeds take center stage in a minimalistic, familiar UI. You
      can follow your favorite websites and blogs without distractions or the risk of your data
      being tracked. Announcing has a strict no-tracking policy, ensuring your privacy is protected.
      No algorithms, no ads, and no intrusive data collection. It’s just pure content, delivered
      simply.
    </div>
  </div>
  <div class="wrapper read-more" class:small>
    <div class="overflow-fade overflowing-y" class:open={openReadMore} use:overflowFade>
      Announcing is the world’s most boring web service, by design. Unlike traditional social media
      platforms, it strips away all the noise—there are no likes, comments, shares, or user
      interactions. It’s a space free from the clutter of social engagement, allowing you to focus
      solely on the content you care about. Essentially, Announcing is a stripped-down version of a
      social media platform, where RSS feeds take center stage in a minimalistic, familiar UI. You
      can follow your favorite websites and blogs without distractions or the risk of your data
      being tracked. Announcing has a strict no-tracking policy, ensuring your privacy is protected.
      No algorithms, no ads, and no intrusive data collection. It’s just pure content, delivered
      simply.
    </div>
    <button
      class="text"
      on:click={() => {
        openReadMore = !openReadMore;
      }}>{openReadMore ? 'Read less' : 'Read more'}</button
    >
  </div>
</div>

<style lang="scss">
  .container {
    max-width: 600px;
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .small {
      max-width: 400px;
    }

    .wrapper {
      padding: 8px;
      border: 2px solid silver;
      border-radius: 8px;
      .overflow-fade:not(.open) {
        max-height: 250px;
      }

      &.read-more {
        button {
          display: none;
          margin: 8px 4px 0 auto;
        }
        .overflowing-y + button {
          display: block;
        }
        .overflow-fade.open + button {
          display: block;
        }
      }
    }
  }
</style>
