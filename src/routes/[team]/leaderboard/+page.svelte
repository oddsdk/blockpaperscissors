<script lang="ts">
  import { page } from '$app/stores'

  import { networkStore } from '$src/stores'
  import { fetchAllAccounts, fetchTopStreaks } from '$lib/contract'
  import Divider from '$components/common/Divider.svelte'
  import InContextLoader from '$components/common/InContextLoader.svelte'
  import Top10Streaks from '$components/leaderboard/Top10Streaks.svelte'
  import Top10Voters from '$components/leaderboard/Top10Voters.svelte'

  const tabs = [
    {
      imgSrc: 'chain',
      label: 'Top 10 Streaks',
    },
    {
      imgSrc: 'play',
      label: 'Top 10 Voters',
    },
    {
      imgSrc: 'handshake',
      label: 'A-Team Members',
    },
  ]

  let activeTabIndex = 0
  let allAccounts = fetchAllAccounts()
  let topStreaks = fetchTopStreaks()
  $: $networkStore.blockHeight, (async () => {
    allAccounts = fetchAllAccounts()
    topStreaks = fetchTopStreaks()
  })();
</script>

<Divider align="right" size="small" />

<h1 class="text-3xl pt-8 pb-10 uppercase">
  Leaders
</h1>

<Divider size="medium" />

<div class="flex items-center justify-center divide-x divide-beige-400 w-full my-8">
  {#each tabs as tab, i}
    <button
      class="flex items-center justify-center grow py-2 h-[48px] {activeTabIndex === i ? 'bg-beige-400' : 'bg-black-500'}"
      on:click={() => activeTabIndex = i}
    >
      <img src="{window.location.origin}/{tab.imgSrc}.svg" alt={tab.label} class="w-[27px] h-auto" />
    </button>
  {/each}
</div>

{#await allAccounts}
  <InContextLoader />
{:then}
  {#if activeTabIndex == 0}
    <Top10Streaks />
  {/if}

  {#if activeTabIndex == 1}
    <Top10Voters />
  {/if}

  {#if activeTabIndex == 2}
    <p class="w-full mb-6 flex justify-between items-center text-lg font-bold">
      A-Team Members <a class="text-blue-500 underline" href="/{$page.params.team}/help">Wut? 🤔</a>
    </p>
  {/if}
{/await}
