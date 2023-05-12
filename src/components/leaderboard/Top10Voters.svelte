<script lang="ts">
  import { page } from '$app/stores'

  import { contractStore, sessionStore } from '$src/stores'
  import { getTop10Streaks } from '$lib/leaderboard'

  console.log('$contractStore', $contractStore)

  const top10Accounts = getTop10Streaks()
  console.log('top10Accounts', top10Accounts)
</script>

<p class="w-full mb-6 flex justify-between items-center text-lg font-bold">
  Top 10 Voters <a class="text-blue-500 underline" href="/{$page.params.team}/help">Wut? 🤔</a>
</p>

<div class="flex items-center justify-between mb-2 text-xs font-bold uppercase">
  <p>Address</p>
  <p>Power</p>
</div>

<div class="flex flex-col text-lg gap-0.5">
  {#each top10Accounts as account}
    {@const currentUser = account?.address?.toLowerCase() === $sessionStore?.address?.toLowerCase()}
    <div class="flex items-center justify-between {currentUser ? 'font-bold' : ''}">
      <p class="flex items-center gap-1.5">{account.address.slice(0, 6)}...{account.address.slice(38, $sessionStore.address.length)}{#if currentUser}<img src="{window.location.origin}/profile.svg" alt="active streak" class="w-[22px] h-auto" />{/if}</p>
      <p>{account?.movesMade}</p>
    </div>
  {/each}
</div>
