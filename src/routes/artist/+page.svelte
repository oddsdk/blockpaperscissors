<script lang="ts">
  import { fetchGameState } from '$lib/contract'
  import { contractStore } from '$src/stores'
  import Countdown from '$components/common/Countdown.svelte'
  import PersonaNav from '$components/nav/PersonaNav.svelte'
  import ProfileInfo from '$components/account/ProfileInfo.svelte'
  import ViewGrid from '$components/artist/ViewGrid.svelte'

  if (!$contractStore?.previousWinner) {
    fetchGameState()
  }
</script>

<ProfileInfo />

<ViewGrid />

<a href="/artist/vote" class="btn btn-primary btn-lg w-full mb-4 justify-between text-lg uppercase rounded-none">
  Suggest a color <Countdown />
</a>

<button disabled={true} class="btn btn-outline btn-lg w-full border-[6px] text-lg uppercase rounded-none">
  Free draw mode
</button>

<PersonaNav />
