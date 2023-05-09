<script lang="ts">
  import { page } from '$app/stores'

  import { fetchGameState } from '$lib/contract'
  import { contractStore } from '$src/stores'
  import { COLOR_MAP, WINNING_MOVES_MAP } from '$lib/contract'
  import Countdown from '$components/common/Countdown.svelte'
  import Divider from '$components/common/Divider.svelte'
  import ProfileInfo from '$components/account/ProfileInfo.svelte'


  if (!$contractStore?.results?.length) {
    fetchGameState()
  }

  $: previousMove = $contractStore?.previousWinner?.result
</script>

<div class="py-7">
  <div class="fixed top-0 left-0 right-0 px-10 py-6 flex items-center justify-between bg-black-500 text-base-100 font-bold text-base">
    <div class="flex items-center gap-2">
      <img src="{window.location.origin}/chain.svg" class="h-[15px] w-auto" alt="streak" />
      <p>STREAK: 2</p>
    </div>
    <div class="flex items-center gap-2">
      <img src="{window.location.origin}/leaderboard.svg" class="h-[15px] w-auto" alt="trophy" />
      <p>24</p>
    </div>
  </div>

  {#if $contractStore?.results?.length && previousMove}
    <div class="mb-8">
      <ProfileInfo />
    </div>

    <div class="flex flex-col gap-2 mb-10">
      <Divider />
      <div class="flex items-center justify-between text-xs">
        <p class="uppercase font-bold">Current Move</p>
        <p>{$contractStore?.previousWinner?.votesByPersona?.builder?.total} builder{$contractStore?.previousWinner?.votesByPersona?.builder?.total !== 1 ? 's' : ''}</p>
      </div>
    </div>

    <div class="flex items-center justify-center gap-2 mb-10">
      <span class="flex items-center justify-center w-[125px] h-[125px] rounded-full bg-base-content text-base-100 text-center text-3xl font-bold">?</span>
      <span class="font-bold text-lg">vs</span>
      <img class="w-[127px] h-auto" src={`${window.location.origin}/${previousMove}.svg`} alt={previousMove} />
    </div>

    <p class="text-lg text-center max-w-[220px] mb-10 mx-auto">Vote <span class="uppercase font-bold {COLOR_MAP[WINNING_MOVES_MAP[previousMove]]?.text}">{WINNING_MOVES_MAP[previousMove]}</span> to keep the streak alive</p>
  {/if}

  <a href="/{$page.params.team}/vote" class="btn btn-primary btn-lg w-full mb-6 justify-between text-lg uppercase rounded-none">
    Cast your vote <Countdown />
  </a>

  {#if $contractStore?.results?.length && previousMove}
    <div class="flex flex-col gap-2 mb-10">
      <Divider />
      <div class="flex items-center justify-between text-xs">
        <p class="uppercase font-bold">Network Streak</p>
        <!-- <p class="flex gap-2 items-center font-bold"><img class="w-[13px] h-auto" src={`${window.location.origin}/history.png`} alt="trophy" /> 23</p> -->
      </div>
    </div>

    <div class="flex flex-col items-center justify-center gap-2 text-center">
      <p class="font-bold text-2xl">{$contractStore?.networkStreak} Win{$contractStore?.networkStreak !== '1' ? 's' : ''}</p>
      <!-- <p>Everybody’s 10 wins away from a high score!</p> -->
    </div>
  {/if}
</div>
