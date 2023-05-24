<script lang="ts">
  import { page } from '$app/stores'

  import Divider from '$components/common/Divider.svelte'
</script>

<Divider size="small" />

<h1 class="text-3xl pt-8 pb-10">
  WELCOME<br/>
  TO THE<br/>
  NETWORK
</h1>

<Divider align="right" size="medium" />

<h2 class="text-xl py-10 font-bold">
  This is a game of mass coordination
</h2>

<Divider />

<div class="flex flex-col gap-6 py-8">
  <p class="text-base">
    You’ve probably played rock, paper, scissors before. But not quite like this.
  </p>
  <p class="text-base">
    <span class="text-red-500 font-bold">BLOCK</span>, <span class="text-green-500 font-bold">PAPER</span>, <span class="text-blue-500 font-bold">SCISSORS</span> is a Whole Network Game and the first release in our SLW RK’D (👂 “slow arcade”).
  </p>
  <p class="text-base">
    Everyone votes together to make the next move. Win, lose or .... draw.
  </p>
</div>

<a class="btn btn-primary btn-lg w-full mb-4 text-lg uppercase rounded-none" href={`/${$page.params.team}/play`}>
  Let's go!
</a>
