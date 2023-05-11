<script lang="ts">
  import { contractStore } from '$src/stores'
  import { moveHistoryMap } from '$lib/contract'

  // Scroll to bottom of the list(this is a little sketchy)
  let scrollTarget
  $: {
    if (scrollTarget) {
      console.log('scrolling 2', document.body.scrollHeight)
      setTimeout(() => {
        const scroll = () => window.scrollTo({
          top: document.body.scrollHeight,
        })
        scroll()
      }, 10)
    }
  }
</script>

<div class="flex flex-col">
  {#each $contractStore?.results?.toReversed() as result, i}
    {#if result?.result === 'stalemate'}
      <div class="flex items-center justify-center py-[18px]">
        <p class="text-base py-3">STALEMATE</p>
      </div>
    {:else if result?.result === 'draw'}
      <div class="flex items-center justify-center py-[18px]">
        <p class="text-base py-3">DRAW</p>
      </div>
    {:else}
      {@const moveHistory = moveHistoryMap(result?.result, $contractStore?.results?.slice($contractStore?.results?.toReversed().slice(i).length))}
      <div class="relative z-0 flex items-center justify-center gap-9 py-[18px]">
        {#if moveHistory.result === 'win'}
          <div class="absolute z-0 top-0 left-1/2 -translate-x-1/2 h-10 w-[7px] bg-black-500"></div>
        {/if}

        <img src="{window.location.origin}/{result?.result}.svg" alt="{result?.result}" class="w-[56px] h-auto" />

        {#if moveHistory.result === 'win'}
          <p class="text-base text-yellow-500 font-bold bg-black-500 py-2 px-[15px]">WIN!</p>
        {:else if moveHistory.result === 'loss'}
          <p class="text-base text-red-500 font-bold">LOSS</p>
        {:else}
          <p class="text-base py-3">DRAW</p>
        {/if}

        <img src="{window.location.origin}/{!moveHistory.move ? result.result : moveHistory.move}.svg" alt="{!moveHistory.move ? result.result : moveHistory.move}" class="w-[56px] h-auto" />
      </div>
    {/if}
  {/each}
  <div bind:this={scrollTarget} />
</div>
