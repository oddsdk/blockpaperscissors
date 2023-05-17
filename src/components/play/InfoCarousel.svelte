<script lang="ts">
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

  $: {
    getHighLowVotes()
  }
</script>

<div class="carousel w-full bg-beige-400 mb-6">
  <div id="item1" class="carousel-item w-full h-full flex-col gap-4 pt-5 pb-9 items-center justify-center">
    <p class="uppercase font-bold text-[12px]">To keep the streak</p>
    <p class="text-lg text-center"><span class="uppercase font-bold {COLOR_MAP[WINNING_MOVES_MAP[previousMove]]?.text}">{WINNING_MOVES_MAP[previousMove]}</span> beats <span class="uppercase font-bold {COLOR_MAP[previousMove]?.text}">{previousMove}</span></p>
  </div>
  <div id="item2" class="carousel-item w-full h-full flex-col gap-4 pt-5 pb-9 items-center justify-center">
    <p class="uppercase font-bold text-[12px]">120 votes so far</p>
    <p class="text-lg text-center">LOW: 120 / HIGH: 320</p>
  </div>
  <div id="item3" class="carousel-item w-full h-full flex-col gap-4 pt-5 pb-9 items-center justify-center">
    <p class="uppercase font-bold text-[12px]"># OF VOTES (PAST 10 MOVES)</p>
    <p class="text-lg text-center">LOW: {lowVotes} / HIGH: {highVotes}</p>
  </div>
</div>
