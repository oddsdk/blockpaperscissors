<script lang="ts">
  import { fade, fly } from 'svelte/transition'

  import { COLOR_MAP, fetchGameState } from '$lib/contract'
  import { contractStore } from '$src/stores'
  import Countdown from '$components/common/Countdown.svelte'

  fetchGameState()

  let selectedBlock
  const handleBlockClick = (blockHeight: number) => (selectedBlock = blockHeight)
</script>

<div class="grid grid-cols-16 mt-8 mb-6 w-full border-base-content border-[7px]">
  {#if !$contractStore?.results}
    {#each Array.from({ length: 256 }) as _}
      <div class="inline-block w-full pb-[100%] border-transparent hover:border-base-content bg-transparent"></div>
    {/each}
  {:else}
    {#each $contractStore.results as { blockHeight, result }, i}
      <!-- in:fly={{ x: -10, delay: 0+(i*1), duration: 10 }} -->
      <!-- in:fade={{ delay: 0+(i*1), duration: 5 }} -->
      <div in:fly={{ x: -10, delay: 0+(i*1), duration: 40 }} on:click={() => handleBlockClick(blockHeight)} on:keypress={() => handleBlockClick(blockHeight)} class="inline-block w-full pb-[100%] cursor-pointer transition-colors ease-in-out border border-transparent hover:border-base-content {COLOR_MAP[result].bg} {selectedBlock === blockHeight ? '!bg-base-content' : ''}"></div>
    {/each}
  {/if}
</div>

<div class="text-sm text-center mb-5">
  <p class="font-bold mb-2"><Countdown /> until the <span class="inline-block w-[18px] h-[18px] translate-y-1 bg-base-content"></span> pixel is updated</p>
  <p>{$contractStore.uniqueVoters} artist{$contractStore.uniqueVoters > 1 ? 's' : ''}</p>
</div>

