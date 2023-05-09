<script lang="ts">
  import { fetchGameState } from '$lib/contract'
  import { contractStore } from '$src/stores'
  import Countdown from '$components/common/Countdown.svelte'
  import Divider from '$components/common/Divider.svelte'
  import PersonaNav from '$components/nav/Nav.svelte'
  import PreviousResults from '$components/speculator/PreviousResults.svelte'
  import ProfileInfo from '$components/account/ProfileInfo.svelte'

  if (!$contractStore?.previousWinner) {
    fetchGameState()
  }
</script>

{#if $contractStore?.previousWinner}
  <div class="mb-8">
    <ProfileInfo />
  </div>

  <div class="flex flex-col gap-2 mb-10">
    <Divider />
    <div class="flex items-center justify-between text-xs">
      <p class="uppercase font-bold">Previous Move</p>
      <p>{$contractStore?.previousWinner?.votesByPersona?.speculator?.total} speculator{$contractStore?.previousWinner?.votesByPersona?.speculator?.total !== 1 ? 's' : ''}</p>
    </div>
  </div>

  <PreviousResults />

  <a href="/speculator/vote" class="btn btn-primary btn-lg w-full mb-4 justify-between text-lg uppercase rounded-none">
    Place your bet <Countdown />
  </a>

  <div class="flex flex-col gap-2 mb-10">
    <Divider />
    <div class="flex items-center justify-between text-xs uppercase font-bold">
      <p>Your combo</p>
      <!-- <p>Personal Best: 23</p> -->
    </div>
  </div>

  <div class="flex flex-col items-center justify-center gap-2 text-center">
    <p class="font-bold text-2xl">{$contractStore?.userCombo} Bet{$contractStore?.userCombo !== '1' ? 's' : ''}</p>
    <!-- <p>Everybody’s 10 moves away from a personal best!</p> -->
  </div>
{/if}

<PersonaNav />
