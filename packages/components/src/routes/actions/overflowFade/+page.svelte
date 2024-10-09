<script lang="ts">
  import { overflowFade } from '$lib/actions/overflowFade';
</script>

<div class="container">
  <div class="script1">
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
</div>

<style lang="scss">
  .container {
    max-width: 600px;
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .script1 {
      padding: 8px;
      border: 2px solid silver;
      border-radius: 8px;
      .overflow-fade {
        max-height: 250px;
      }
    }
  }
</style>
