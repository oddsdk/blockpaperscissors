<script lang="ts">
  import { sessionStore } from '$src/stores'
  import Divider from '$components/common/Divider.svelte'
</script>

<Divider align="right" size="small" />

<h1 class="text-3xl pt-8 pb-10 uppercase">
  Account
</h1>

<Divider size="medium" />

<div class="mt-11">
  <p class="mb-6 font-bold text-lg">Credits:<br /><span class="text-green-500 uppercase">UNLIMITED</span></p>
  <p class="mb-6 font-bold text-lg">Connected account:<br /><span class="font-normal">{$sessionStore.address.slice(0, 6)}...{$sessionStore.address.slice(38, $sessionStore.address.length)}</span></p>
  <p class="mb-6 font-bold text-lg">Moves made:<br /><span class="font-normal">4</span></p>
  <p class="mb-6 font-bold text-lg">Blocks since last move:<br /><span class="font-normal">0</span></p>
  <p class="mb-6 font-bold text-lg">Last vote cast:<br /><span class="font-normal">Paper</span></p>
  <p class="mb-6 font-bold text-lg">Perfect plans:<br /><span class="font-normal">1/4</span></p>
  <p class="mb-6 font-bold text-lg">Power score:<br /><span class="font-normal">8.5</span></p>
</div>
