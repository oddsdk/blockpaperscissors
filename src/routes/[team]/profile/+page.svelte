<script lang="ts">
  import { disconnect } from '@wagmi/core'
  import { onMount } from 'svelte'

  import { fetchAllAccounts, fetchMyAccount } from '$lib/contract'
  import { contractStore, networkStore, sessionStore } from '$src/stores'
  import Divider from '$components/common/Divider.svelte'
  import InContextLoader from '$components/common/InContextLoader.svelte'

  const handleLogout = async () => {
    await disconnect()
    window.location.href = window.location.origin
  }

  let power = null
  onMount(async () => {
    await fetchMyAccount()
    await fetchAllAccounts()
    power = $contractStore?.allAccounts?.find((account) => account?.address?.toLowerCase() === $sessionStore?.address?.toLowerCase())?.power ?? 0
  })

  $: $networkStore.blockHeight, (async () => {
    power = $contractStore?.allAccounts?.find((account) => account?.address?.toLowerCase() === $sessionStore?.address?.toLowerCase())?.power ?? 0
    await fetchMyAccount()
  })();
</script>

<Divider align="right" size="small" />

<h1 class="text-3xl pt-8 pb-10 uppercase">
  Account
</h1>

<Divider size="medium" />

{#if $contractStore.myAccount}
  <div class="mt-11 mb-8">
    <p class="mb-6 font-bold text-lg">Credits:<br /><span class="text-green-500 uppercase">UNLIMITED</span></p>
    <p class="mb-6 font-bold text-lg">Connected account:<br /><span class="font-normal">{$sessionStore.address.slice(0, 6)}...{$sessionStore.address.slice(38, $sessionStore.address.length)}</span></p>
    <p class="mb-6 font-bold text-lg">Moves made:<br /><span class="font-normal">{$contractStore.myAccount.movesMade}</span></p>
    <p class="mb-6 font-bold text-lg">Blocks since last move:<br /><span class="font-normal">{$networkStore.blockHeight - $contractStore.myAccount.blockHeightOfLastMove}</span></p>
    <p class="mb-6 font-bold text-lg">Last vote cast:<br /><span class="font-normal {$contractStore.myAccount.lastMove === 'null' ? '' : 'capitalize' }">{$contractStore.myAccount.lastMove === 'null' ? 'No votes cast yet' : $contractStore.myAccount.lastMove}</span></p>
    <!-- <p class="mb-6 font-bold text-lg">Perfect plans:<br /><span class="font-normal">1/4</span></p> -->
    <p class="mb-6 font-bold text-lg">Power score:<br /><span class="font-normal">{#if power}{power.toFixed(1)}{:else}Loading...{/if}</span></p>
  </div>
{:else}
  <InContextLoader />
{/if}

<button on:click={handleLogout} class="btn btn-primary btn-lg w-full mb-2 text-lg uppercase rounded-none">
  Disconnect
</button>
