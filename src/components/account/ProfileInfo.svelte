<script lang="ts">
  import { sessionStore } from '$src/stores'
</script>

{#if $sessionStore.address}
  <div class="flex items-center gap-2">
    <div class="w-8 h-8 bg-base-content rounded-full"></div>
    <div>
      <p class="uppercase text-xs font-bold mb-0.5">{$sessionStore.address.slice(0, 10)}.....{$sessionStore.address.slice(30, $sessionStore.address.length)}</p>
      <p class="text-xxs">Plays left: <span class="text-green-500">UNLIMITED</span></p>
    </div>
  </div>
{/if}
