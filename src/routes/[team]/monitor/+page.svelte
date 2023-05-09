<script lang="ts">
  import { page } from '$app/stores'

  import { fetchGameState } from '$lib/contract'
  import { contractStore } from '$src/stores'
  import Countdown from '$components/common/Countdown.svelte'
  import Divider from '$components/common/Divider.svelte'
  import PersonaNav from '$components/nav/Nav.svelte'
  import ProfileInfo from '$components/account/ProfileInfo.svelte'
  import ViewGrid from '$components/artist/ViewGrid.svelte'

  if (!$contractStore?.previousWinner) {
    fetchGameState()
  }
</script>

<!-- <ProfileInfo /> -->

<Divider align="right" size="small" />

<h1 class="text-3xl pt-8 pb-10 uppercase">
  Canvas
</h1>

<Divider size="medium" />

<p class="w-full flex justify-between items-center text-lg font-bold mt-10">
  Past 256 moves <a class="text-blue-500" href="/{$page.params.team}/help">Wut? 🤔</a>
</p>

<ViewGrid />

<!-- <a href="/{$page.params.team}/vote" class="btn btn-primary btn-lg w-full mb-4 justify-between text-lg uppercase rounded-none">
  Suggest a color <Countdown />
</a>

<button disabled={true} class="btn btn-outline btn-lg w-full border-[6px] text-lg uppercase rounded-none">
  Free draw mode
</button> -->

<PersonaNav />
