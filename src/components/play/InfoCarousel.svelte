<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores'

  import { contractStore, networkStore } from '$src/stores'
  import { COLOR_MAP, WINNING_MOVES_MAP } from '$lib/contract'

  $: previousMove = $contractStore?.previousWinner?.result

  $: highVotes = 0
  $: lowVotes = 0

  // Get the highest and lowest number of votes out of the last 10 blocks
  const getHighLowVotes = () => {
    Array.prototype.max = function() {
      return Math.max.apply(null, this);
    };
    Array.prototype.min = function() {
      return Math.min.apply(null, this);
    };

    const votesPerBlock = $contractStore?.results?.slice(0, 10)?.map((result) => result.block.votes + result.paper.votes + result.scissors.votes)

    highVotes = votesPerBlock.max()
    lowVotes = votesPerBlock.min()
  }
  getHighLowVotes()

  // Daisy UI doesn't have a way of detecting the active slide of a carousel, so we have to add some extra logic
  let dots = [
    '#slide1',
    '#slide2',
    '#slide3',
  ]
  let activeSlide = dots.find(dot => dot === $page.url.hash) || dots[0]
  let scrollContainer
  let slideWidth
  // Track the scroll positon of the carousel and update the activeSlide state accordingly
  const trackCarouselScroll = () => {
    const scrollPosition = scrollContainer.scrollLeft

    if (scrollPosition < slideWidth) {
      activeSlide = dots[0]
    } else if (scrollPosition >= slideWidth && scrollPosition < (slideWidth * 2)) {
      activeSlide = dots[1]
    } else if (scrollPosition >= (slideWidth * 2)) {
      activeSlide = dots[2]
    }
  }
  // Scroll to a given slide
  const scrollToSlide = (slide) => {
    let scrollTarget = 0
    if (slide === dots[1]) {
      scrollTarget = slideWidth
    } else if (slide === dots[2]) {
      scrollTarget = slideWidth * 2
    }
    scrollContainer.scroll({ left: scrollTarget, behavior: 'smooth' });
  }

  // Parse votes cast from the mempool for the next block
  let votesSoFar = 0
  let blockVotes = 0
  let paperVotes = 0
  let scissorsVotes = 0
  let blockPercentage = 0
  let paperPercentage = 0
  let scissorsPercentage = 0
  const parseVotesForNextBlock = () => {
    let nextBlockHeight = Number($networkStore.blockHeight)
    let pendingTransactions = $networkStore.pendingTransactions

    if (pendingTransactions.length > 0) {
      let pendingTransactionsForNextBlock = pendingTransactions.filter((tx) => tx?.blockHeight === nextBlockHeight)
      if (pendingTransactionsForNextBlock.length > 0) {
        votesSoFar = pendingTransactionsForNextBlock.length
        blockVotes = pendingTransactions.filter(tx => tx.choice === 'block').length
        paperVotes = pendingTransactions.filter(tx => tx.choice === 'paper').length
        scissorsVotes = pendingTransactions.filter(tx => tx.choice === 'scissors').length
        const totalVotes = blockVotes + paperVotes + scissorsVotes
        blockPercentage = (blockVotes / totalVotes) * 100
        paperPercentage = (paperVotes / totalVotes) * 100
        scissorsPercentage = (scissorsVotes / totalVotes) * 100
      }
    } else {
      votesSoFar = 0
      blockVotes = 0
      paperVotes = 0
      scissorsVotes = 0
      blockPercentage = 0
      paperPercentage = 0
      scissorsPercentage = 0
    }
  }
  parseVotesForNextBlock()

  onMount(() => {
    const unsubscribe = networkStore.subscribe(() => {
      parseVotesForNextBlock()
    })

    return () => unsubscribe()
  })

  $: {
    getHighLowVotes()
  }
</script>

<div class="relative bg-beige-400 mb-6">
  <div class="carousel w-full" bind:this={scrollContainer} on:scroll={trackCarouselScroll}>
    <div id="slide1" bind:clientWidth={slideWidth} class="carousel-item w-full h-full flex-col gap-4 pt-5 pb-9 items-center justify-center">
      <p class="uppercase font-bold text-[12px]">To keep the streak</p>
      <p class="text-lg text-center"><span class="uppercase font-bold {COLOR_MAP[WINNING_MOVES_MAP[previousMove]]?.text}">{WINNING_MOVES_MAP[previousMove]}</span> beats <span class="uppercase font-bold {COLOR_MAP[previousMove]?.text}">{previousMove}</span></p>
    </div>
    <div id="slide2" class="carousel-item w-full h-full flex-col pt-5 {votesSoFar ? 'gap-1 pb-[10px]' : 'gap-4 pb-9'} items-center justify-center">
      <p class="uppercase font-bold text-[12px]">{votesSoFar} votes so far</p>

      {#if blockVotes === 0 && paperVotes === 0 && scissorsVotes === 0}
        <p class="text-lg text-center">No votes cast for next block</p>
      {:else}
        <div class="w-full pt-[22px] px-6 h-[52px]">
          <div class="relative w-full h-2">
            <div class="absolute z-10 top-0 left-0 bottom-0 transition-all rounded-l-xl {blockPercentage === 100 ? 'rounded-r-xl' : ''} w-[{blockPercentage}%] {COLOR_MAP.block.bg}">
              <div class="absolute left-0 bottom-[calc(100%+4px)] flex items-center overflow-visible w-[110px]">
                <img class="w-4 h-auto" src={`${window.location.origin}/block.svg`} alt="block" />
                <p class="uppercase text-[10px] ml-1.5">{blockVotes}</p>
              </div>
            </div>
            <div class="absolute z-10 top-0 {blockPercentage === 0 ? 'rounded-l-xl' : ''} {scissorsPercentage === 0 ? 'rounded-r-xl' : ''} {blockPercentage > 60 ? `right-[${scissorsPercentage}%]` : `left-[${blockPercentage}%]`} bottom-0 transition-all w-[{paperPercentage}%] {COLOR_MAP.paper.bg}">
              <div class="absolute left-0 top-[calc(100%+4px)] flex items-center overflow-visible w-[110px]">
                <img class="w-4 h-auto" src={`${window.location.origin}/paper.svg`} alt="paper" />
                <p class="uppercase text-[10px] ml-1.5">{paperVotes}</p>
              </div>
            </div>
            <div class="absolute z-10 top-0 right-0 bottom-0 transition-all rounded-r-xl {scissorsPercentage === 100 ? 'rounded-l-xl' : ''} w-[{scissorsPercentage}%] {COLOR_MAP.scissors.bg}">
              <div class="absolute right-0 bottom-[calc(100%+4px)] flex items-center justify-end overflow-visible w-[110px]">
                <p class="uppercase text-[10px] mr-1.5">{scissorsVotes}</p>
                <img class="w-4 h-auto" src={`${window.location.origin}/scissors.svg`} alt="scissors" />
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
    <div id="slide3" class="carousel-item w-full h-full flex-col gap-4 pt-5 pb-9 items-center justify-center">
      <p class="uppercase font-bold text-[12px]"># OF VOTES (PAST 10 MOVES)</p>
      <p class="text-lg text-center">LOW: {lowVotes} / HIGH: {highVotes}</p>
    </div>
  </div>
  <div class="absolute bottom-1 z-10 flex items-center justify-center w-full gap-1">
    {#each dots as dot}
      <button on:click={() => scrollToSlide(dot)}><span class="block w-[5px] h-[5px] {activeSlide === dot ? 'bg-base-content' : 'bg-beige-500'} rounded-full"></span></button>
    {/each}
  </div>
</div>
