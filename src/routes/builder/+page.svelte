<script lang="ts">
  import { fetchGameState } from '$lib/contract'
  import { contractStore } from '$src/stores'
  import { COLOR_MAP, WINNING_MOVES_MAP } from '$lib/contract'
  import Countdown from '$components/common/Countdown.svelte'
  import Divider from '$components/common/Divider.svelte'
  import PersonaNav from '$components/nav/PersonaNav.svelte'
  import ProfileInfo from '$components/account/ProfileInfo.svelte'


  if (!$contractStore?.results?.length) {
    fetchGameState()
  }

  const previousMove = $contractStore?.previousWinner?.result
</script>

{#if $contractStore?.results?.length}
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

  <a href="/builder/vote" class="btn btn-primary btn-lg w-full mb-6 justify-between text-lg uppercase rounded-none">
    Cast your vote <Countdown />
  </a>

  <div class="flex flex-col gap-2 mb-10">
    <Divider />
    <div class="flex items-center justify-between text-xs">
      <p class="uppercase font-bold">Current Streak</p>
      <p class="flex gap-2 items-center font-bold"><img class="w-[13px] h-auto" src={`${window.location.origin}/history.png`} alt="trophy" /> 23</p>
    </div>
  </div>

  <div class="flex flex-col items-center justify-center gap-2 text-center">
    <p class="font-bold text-2xl">13 Wins</p>
    <p>Everybody’s 10 wins away from a high score!</p>
  </div>
{/if}

<PersonaNav />
