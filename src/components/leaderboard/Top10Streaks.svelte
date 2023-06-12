<script lang="ts">
  import { page } from '$app/stores'

  import { fetchTopStreaks } from '$lib/contract'
  import { contractStore, networkStore } from '$src/stores'
  import InContextLoader from '$components/common/InContextLoader.svelte'

  let topStreaks = fetchTopStreaks()
  $: $networkStore.blockHeight, (async () => {
    topStreaks = fetchTopStreaks()
  })();
</script>

<p class="w-full mb-6 flex justify-between items-center text-lg font-bold">
  Top 10 Streaks <a class="text-blue-500 underline" href="/{$page.params.team}/help">Wut? 🤔</a>
</p>

<div class="flex items-center justify-between mb-2 text-xs font-bold uppercase">
  <p>Chain</p>
  <p>Moves</p>
</div>

{#await topStreaks}
  <InContextLoader />
{:then}
  <div class="flex flex-col text-lg gap-0.5">
    {#each $contractStore.topStreaks as streak}
      {#if streak?.length > 0}
        {@const activeStreak = streak?.endBlockHeight === $contractStore?.previousWinner?.blockHeight && streak?.lastWinningMove === $contractStore?.previousWinner?.result}
        <div class="flex items-center justify-between {activeStreak ? 'font-bold' : ''}">
          <p class="flex items-center gap-1.5 capitalize">{$page.params.team}{#if activeStreak}<img src="{window.location.origin}/monitor.svg" alt="active streak" class="w-[22px] h-auto" />{/if}</p>
          <p>{streak?.length}</p>
        </div>
      {/if}
    {/each}
  </div>
{/await}
