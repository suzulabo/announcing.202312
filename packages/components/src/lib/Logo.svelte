<script lang="ts">
  export let size = '64px';
</script>

<svg
  viewBox="0 0 1000 1000"
  xmlns="http://www.w3.org/2000/svg"
  version="1.1"
  width={size}
  height={size}
>
  <g>
    <ellipse cx="500" cy="500" fill="#ffffff" rx="500" ry="500" />
    <path
      d="m513.5,138q12,14 58,53.5t84,74.5t70,89t32,105q0,95 -122,174q-14,9 -25,-5q-8,-13 4,-23q53,-39 71.5,-68t18.5,-68q0,-47 -52,-102.5t-142,-95.5q-8,-4 -8,5l0,453q0,71 -40,110.5t-110,39.5q-48,0 -79,-25.5t-31,-64.5q0,-49 39,-82t101,-33q39,0 74,19l2,0q1,-1 1,-2l0,-550q0,-9 6,-15.5t15,-6.5q19,0 33,18z"
      fill="#000000"
    />
  </g>
</svg>

<style lang="scss">
  svg {
    display: inline-block;
  }
</style>
