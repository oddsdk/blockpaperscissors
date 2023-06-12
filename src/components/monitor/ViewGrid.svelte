<script lang="ts">
  import { onDestroy } from 'svelte'
  import { fly } from 'svelte/transition'

  import { COLOR_MAP, fetchGameState } from '$lib/contract'
  import { contractStore } from '$src/stores'
  import Countdown from '$components/common/Countdown.svelte'

  $: results = null
  $: blockHeightToTrack = null
  $: blocksToUpdate = []

  const unsubscribe = contractStore.subscribe((state) => {
    if (state.results && !results) {
      results = [
        ...state.results.slice(0, 256)
      ]
      blockHeightToTrack = state.results[0]?.blockHeight
      blocksToUpdate = [state.results[0]]
    } else if (state.results) {
      let indexOfInitialBlock = state.results.findIndex((result) => result.blockHeight === blockHeightToTrack)
      if (indexOfInitialBlock >= 255) {
        blockHeightToTrack = state.results[0].blockHeight
        indexOfInitialBlock = state.results.findIndex((result) => result.blockHeight === blockHeightToTrack)
      }
      for (let i = 0; i < indexOfInitialBlock; i++) {
        if (!blocksToUpdate.find((result) => result.blockHeight === state.results[i].blockHeight)) {
          blocksToUpdate = [
            state.results[i],
            ...blocksToUpdate,
          ]
        }
      }
    }
  })

  fetchGameState()

  onDestroy(unsubscribe)
</script>

<div class="relative w-full mt-6 mb-6 border-base-content border-[7px]">
  <div class="relative z-10 grid grid-cols-16 w-full">
    {#if !results}
      {#each Array.from({ length: 256 }) as _, i}
        <div class="inline-block w-full pb-[100%] border-transparent hover:border-base-content bg-transparent"></div>
      {/each}
    {:else}
      {#each results as { result }, i}
        <div in:fly={{ x: -10, delay: 0+(i*1), duration: 40 }} class="inline-block w-full pb-[100%] cursor-pointer transition-colors ease-in-out border border-transparent hover:border-base-content {COLOR_MAP[result].bg}"></div>
      {/each}
    {/if}
  </div>
  <div class="absolute top-0 right-0 bottom-0 left-0 z-10 grid grid-cols-16 w-full">
    {#if !results}
      {#each Array.from({ length: 256 }) as _}
        <div class="inline-block w-full pb-[100%] border-transparent hover:border-base-content bg-transparent"></div>
      {/each}
    {:else}
      {#each $contractStore.results?.slice(0, 256) as { blockHeight, result }, i}
        <div in:fly={{ x: -10, delay: 0+(i*1), duration: 40 }} class="inline-block w-full pb-[100%] cursor-pointer transition-colors ease-in-out border border-transparent hover:border-base-content {!!blocksToUpdate[i] ? COLOR_MAP[result].bg : 'bg-transparent'} {blockHeightToTrack === blockHeight ? '!bg-base-content' : ''}"></div>
      {/each}
    {/if}
  </div>
</div>

<div class="text-sm text-center mb-5">
  <p class="font-bold mb-2"><Countdown /> until the <span class="inline-block w-[18px] h-[18px] translate-y-1 bg-base-content"></span> pixel is updated</p>
</div>

