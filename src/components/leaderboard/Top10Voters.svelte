<script lang="ts">
  import { page } from '$app/stores'

  import { contractStore, sessionStore } from '$src/stores'
  import { getTop10Voters } from '$lib/leaderboard'

  const top10Voters = getTop10Voters()
</script>

<p class="w-full mb-6 flex justify-between items-center text-lg font-bold">
  Top 10 Voters <a class="text-blue-500 underline" href="/{$page.params.team}/help">Wut? 🤔</a>
</p>

<div class="flex items-center justify-between mb-2 text-xs font-bold uppercase">
  <p>Address</p>
  <p>Power</p>
</div>

<div class="flex flex-col text-lg gap-0.5 mb-6">
  {#each top10Voters as account}
    {@const currentUser = account?.address?.toLowerCase() === $sessionStore?.address?.toLowerCase()}
    <div class="flex items-center justify-between {currentUser ? 'font-bold' : ''}">
      <p class="flex items-center gap-1.5">{account.address.slice(0, 6)}...{account.address.slice(38, account.address.length)}{#if currentUser}<img src="{window.location.origin}/profile.svg" alt="active streak" class="w-[22px] h-auto" />{/if}</p>
      <p>{account?.power?.toFixed(1)}</p>
    </div>
  {/each}
</div>

<div class="flex items-center mb-2 text-xs font-bold uppercase">
  <p>You</p>
</div>

<div class="flex flex-col text-lg gap-0.5">
  <div class="flex items-center justify-between">
    <p class="flex items-center gap-1.5">{$sessionStore?.address?.slice(0, 6)}...{$sessionStore.address.slice(38, $sessionStore.address.length)}</p>
    <p>{$contractStore?.allAccounts?.find(account => account?.address === $sessionStore?.address)?.power?.toFixed(1)}</p>
  </div>
</div>
