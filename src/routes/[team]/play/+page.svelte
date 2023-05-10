<script lang="ts">
  import { page } from '$app/stores'

  import { fetchGameState } from '$lib/contract'
  import { contractStore } from '$src/stores'
  import { COLOR_MAP, WINNING_MOVES_MAP } from '$lib/contract'
  import Countdown from '$components/common/Countdown.svelte'
  import MoveHistory from '$components/play/MoveHistory.svelte'

  if (!$contractStore?.results?.length) {
    fetchGameState()
  }
  console.log('contractStore', $contractStore)

  $: previousMove = $contractStore?.previousWinner?.result
</script>

<div class="py-7">
  {#if $contractStore?.results?.length && previousMove}
    <!-- Header scoreboard -->
    <div class="fixed z-10 top-0 left-0 right-0 px-10 py-6 flex items-center justify-between bg-black-500 text-base-100 font-bold text-base">
      <div class="flex items-center gap-2">
        <img src="{window.location.origin}/chain.svg" class="h-[15px] w-auto" alt="streak" />
        <p>STREAK: {$contractStore?.networkStreak}</p>
      </div>
      <div class="flex items-center gap-2">
        <img src="{window.location.origin}/leaderboard.svg" class="h-[15px] w-auto" alt="trophy" />
        <p>24</p>
      </div>
    </div>
    <div class="faded-overlay fixed z-10 top-[67px] left-0 right-0" />

    <!-- Move history -->
    <MoveHistory />

    <!-- Your move vs the current move -->
    <div class="relative left-0 right-0 mt-8 flex items-center justify-center border-black-500 border-t-[7px] border-dashed"><span class="p-4 -translate-y-[26px] inline-block rounded-full bg-black-500 text-yellow-500 text-xs font-bold">CURRENT MOVE</span></div>
    <div class="flex items-center justify-center gap-6 mt-2 mb-10">
      <span class="flex items-center justify-center w-[98px] h-[98px] rounded-full bg-beige-400 text-center"><img src={`${window.location.origin}/questionmark.svg`} alt="question mark" /></span>
      <span class="font-bold text-xs">vs</span>
      <img class="w-[91px] h-auto" src={`${window.location.origin}/${previousMove}.svg`} alt={previousMove} />
    </div>

    <!-- Carousel -->
    <div class="carousel w-full bg-beige-400 mb-6">
      <div id="item1" class="carousel-item w-full h-full flex-col gap-4 pt-5 pb-9 items-center justify-center">
        <p class="uppercase font-bold text-[12px]">To keep the streak</p>
        <p class="text-lg text-center"><span class="uppercase font-bold {COLOR_MAP[WINNING_MOVES_MAP[previousMove]]?.text}">{WINNING_MOVES_MAP[previousMove]}</span> beats <span class="uppercase font-bold {COLOR_MAP[previousMove]?.text}">{previousMove}</span></p>
      </div>
      <div id="item2" class="carousel-item w-full">
        content
      </div>
      <div id="item3" class="carousel-item w-full">
        content
      </div>
    </div>
  {/if}

  <a href="/{$page.params.team}/vote" class="btn btn-primary btn-lg w-full mb-6 justify-between !text-yellow-500 text-lg uppercase rounded-none">
    Cast your vote <Countdown />
  </a>
</div>
