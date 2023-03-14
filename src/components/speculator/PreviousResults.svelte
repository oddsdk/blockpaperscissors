<script lang="ts">
  import { COLOR_MAP } from '$lib/contract'
  import { contractStore } from '$src/stores'

  // Get votes of each move
  let blockVotes = $contractStore?.previousWinner?.block?.votes
  let paperVotes = $contractStore?.previousWinner?.paper?.votes
  let scissorsVotes = $contractStore?.previousWinner?.scissors?.votes
  let totalVotes = blockVotes + paperVotes + scissorsVotes

  // Get percentage of each move
  let blockPercentage = (blockVotes/totalVotes)*100
  let paperPercentage = (paperVotes/totalVotes)*100
  let scissorsPercentage = (scissorsVotes/totalVotes)*100

  // Get votes by persona
  let votesByPersona = $contractStore?.previousWinner?.votesByPersona

  $: {
    blockVotes = $contractStore?.previousWinner?.block?.votes
    paperVotes = $contractStore?.previousWinner?.paper?.votes
    scissorsVotes = $contractStore?.previousWinner?.scissors?.votes
    totalVotes = blockVotes + paperVotes + scissorsVotes
    blockPercentage = (blockVotes/totalVotes)*100
    paperPercentage = (paperVotes/totalVotes)*100
    scissorsPercentage = (scissorsVotes/totalVotes)*100

    votesByPersona = $contractStore?.previousWinner?.votesByPersona
  }
</script>

<div class="relative w-full h-8 mb-11">
  <div class="absolute z-10 top-0 left-0 bottom-0 transition-all w-[{blockPercentage}%] {COLOR_MAP.block.bg}">
    <div class="absolute left-0 bottom-[calc(100%+4px)] flex items-center overflow-visible w-[110px]">
      <img class="w-[25px] h-auto" src={`${window.location.origin}/block.svg`} alt="block" />
      <p class="uppercase text-[10px] ml-1.5">{blockVotes} Vote{blockVotes !== 1 ? 's' : ''} ({blockPercentage}%)</p>
    </div>
  </div>
  <div class="absolute z-10 top-0 {blockPercentage > 60 ? `right-[${scissorsPercentage}%]` : `left-[${blockPercentage}%]`} bottom-0 transition-all w-[{paperPercentage}%] {COLOR_MAP.paper.bg}">
    <div class="absolute left-0 top-[calc(100%+4px)] flex items-center overflow-visible w-[110px]">
      <img class="w-[25px] h-auto" src={`${window.location.origin}/paper.svg`} alt="paper" />
      <p class="uppercase text-[10px] ml-1.5">{paperVotes} Vote{paperVotes !== 1 ? 's' : ''} ({paperPercentage}%)</p>
    </div>
  </div>
  <div class="absolute z-10 top-0 right-0 bottom-0 transition-all w-[{scissorsPercentage}%] {COLOR_MAP.scissors.bg}">
    <div class="absolute right-0 bottom-[calc(100%+4px)] flex items-center justify-end overflow-visible w-[110px]">
      <p class="uppercase text-[10px] mr-1.5">{scissorsVotes} Vote{scissorsVotes !== 1 ? 's' : ''} ({scissorsPercentage}%)</p>
      <img class="w-[25px] h-auto" src={`${window.location.origin}/scissors.svg`} alt="scissors" />
    </div>
  </div>
  <p class="absolute z-20 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 uppercase font-bold font-[21px] text-base-100">{$contractStore?.previousWinner?.result} won!</p>
</div>

<div class="mb-8">
  <p class="font-bold text-xxs uppercase mb-3">Winners</p>
  <div class="flex flex-col gap-3 mb-6">
    {#each Object.keys(votesByPersona) as persona}
      {#if votesByPersona[persona]?.majorityChoice === $contractStore?.previousWinner?.result && votesByPersona[persona]?.percentageForMajority > 0}
        <p class="flex items-center text-sm"><img class="w-4 h-auto mr-4" src={`${window.location.origin}/${persona}.png`} alt={persona} />{votesByPersona[persona]?.percentageForMajority}% of {persona}s chose <span class="uppercase pl-1">{$contractStore?.previousWinner?.result}</span></p>
      {/if}
    {/each}
  </div>

  {#if ![votesByPersona?.artist?.majorityChoice, votesByPersona?.builder?.majorityChoice, votesByPersona?.speculator?.majorityChoice].includes($contractStore?.previousWinner?.result) }
    <p class="font-bold text-xxs uppercase mb-3">Losers</p>
    <div class="flex flex-col gap-3">
      {#each Object.keys(votesByPersona) as persona}
        {#if votesByPersona[persona]?.majorityChoice !== $contractStore?.previousWinner?.result}
          <p class="flex items-center text-sm"><img class="w-4 h-auto mr-4" src={`${window.location.origin}/${persona}.png`} alt={persona} />{votesByPersona[persona]?.percentageForMajority}% of {persona}s chose <span class="uppercase pl-1">{votesByPersona[persona]?.majorityChoice}</span></p>
        {/if}
      {/each}
    </div>
  {/if}
</div>
