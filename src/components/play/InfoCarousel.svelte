<script lang="ts">
  import { page } from '$app/stores'

  import { contractStore } from '$src/stores'
  import { COLOR_MAP, WINNING_MOVES_MAP } from '$lib/contract'

  $: previousMove = $contractStore?.previousWinner?.result

  $: highVotes = 0
  $: lowVotes = 0

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

  const scrollToSlide = (slide) => {
    let scrollTarget = 0
    if (slide === dots[1]) {
      scrollTarget = slideWidth
    } else if (slide === dots[2]) {
      scrollTarget = slideWidth * 2
    }
    scrollContainer.scroll({ left: scrollTarget, behavior: 'smooth' });
  }

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
    <div id="slide2" class="carousel-item w-full h-full flex-col gap-4 pt-5 pb-9 items-center justify-center">
      <p class="uppercase font-bold text-[12px]">120 votes so far</p>
      <p class="text-lg text-center">LOW: 120 / HIGH: 320</p>
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
