<script lang="ts">
  import { page } from '$app/stores'

  import { fetchGameState } from '$lib/contract'
  import { contractStore } from '$src/stores'
  import { COLOR_MAP, WINNING_MOVES_MAP } from '$lib/contract'
  import Countdown from '$components/common/Countdown.svelte'
  import Divider from '$components/common/Divider.svelte'


  if (!$contractStore?.results?.length) {
    fetchGameState()
  }

  $: previousMove = $contractStore?.previousWinner?.result
</script>

<div class="py-7">

  <div class="fixed top-0 left-0 right-0 px-10 py-6 flex items-center justify-between bg-black-500 text-base-100 font-bold text-base">
    <div class="flex items-center gap-2">
      <img src="{window.location.origin}/chain.svg" class="h-[15px] w-auto" alt="streak" />
      <p>STREAK: {$contractStore?.networkStreak}</p>
    </div>
    <div class="flex items-center gap-2">
      <img src="{window.location.origin}/leaderboard.svg" class="h-[15px] w-auto" alt="trophy" />
      <p>24</p>
    </div>
  </div>

  {#if $contractStore?.results?.length && previousMove}
    <!-- Your move vs the current move -->
    <div class="flex items-center justify-center gap-6 mb-10">
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
        <img src="/images/stock/photo-1609621838510-5ad474b7d25d.jpg" class="w-full" />
      </div>
      <div id="item3" class="carousel-item w-full">
        <img src="/images/stock/photo-1414694762283-acccc27bca85.jpg" class="w-full" />
      </div>
    </div>
  {/if}

  <a href="/{$page.params.team}/vote" class="btn btn-primary btn-lg w-full mb-6 justify-between !text-yellow-500 text-lg uppercase rounded-none">
    Cast your vote <Countdown />
  </a>
</div>
