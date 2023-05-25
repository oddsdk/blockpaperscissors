<script lang="ts">
  import { goto } from '$app/navigation'
  import { fly } from 'svelte/transition'

  import { sessionStore } from '$src/stores'
  import Divider from '$components/common/Divider.svelte'

  const teams = {
    filecoin: 'Filecoin',
    polygon: 'Polygon',
    ethereum: 'Ethereum',
    'polygon-zkevm': 'Polygon zkEVM',
    optimism: 'Optimism',
    arbitrum: 'Arbitrum',
  }

  let teamSelected = true
  let team: string = 'filecoin'

  const handleTeamClick = (t: string): void => {
    teamSelected = true
    team = t
  }

  const handleButtonClick = (): void => {
    const path = $sessionStore.address ? `/${team}/intro` : `/${team}/connect`
    localStorage.setItem('team', team)
    goto(path)
  }
</script>

<Divider align="right" size="small" />

<h1 class="text-3xl pt-8 pb-10">
  CHOOSE<br/>
  YOUR<br/>
  TEAM
</h1>

<Divider size="medium" />

<h2 class="text-lg pt-6 mb-4 font-bold">
  You&apos;ll compete against the other blockchains for the longest streak.
</h2>

<div class="flex flex-col gap-2 mb-8">
  {#each Object.keys(teams) as key, i}
    <button in:fly={{ x: -10, delay: 0+(i*20), duration: 250 }} on:click={() => handleTeamClick(key)} disabled={i > 2} class="flex flex-col gap-3 {i > 2 ? 'text-beige-500' : '' }">
      <div class="relative w-full flex items-center gap-3 text-xl">
        <span class="w-6 h-6 rounded-full border-base-content border-[5px] transition-colors ease-in-out {team === key ? 'bg-base-content' : ''} {i > 2 ? 'border-beige-500' : '' }"></span>
        <span class="font-bold">{teams[key]}</span>
        {#if i > 2}
          <span class="absolute top-0 right-0 font-bold text-red-500 text-xs text-right">
            coming<br />
            soon!
          </span>
        {/if}
      </div>
    </button>
  {/each}
</div>

<button disabled={!teamSelected} on:click={handleButtonClick} class="btn btn-primary btn-lg w-full mb-4 text-lg uppercase rounded-none">
  Yes! Let&apos;s Play
</button>
