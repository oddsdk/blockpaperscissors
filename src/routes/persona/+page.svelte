<script lang="ts">
  import { goto } from '$app/navigation'
  import { fly } from 'svelte/transition'

  import Divider from '$components/common/Divider.svelte'

  let personaSelected = false
  let persona: string

  const personas = {
    builder: 'I\’d like to see everyone work together for a greater outcome.',
    speculator: 'I\’ll happily ride the current trend for personal gain.',
    artist: 'Few understand that the network is a blank canvas.',
  }

  const handlePersonaClick = (p: string): void => {
    personaSelected = true
    persona = p
  }

  const handleButtonClick = (): void => {
    goto(`/${persona}`)
  }
</script>

<Divider align="right" size="small" />

<h1 class="text-3xl pt-8 pb-10">
  WHAT'S<br/>
  YOUR<br/>
  STYLE?
</h1>

<Divider size="medium" />

<div class="flex flex-col gap-8 py-8">
  {#each Object.keys(personas) as key, i}
    <button in:fly={{ x: -10, delay: 0+(i*20), duration: 250 }} on:click={() => handlePersonaClick(key)} class="flex flex-col gap-3">
      <div class="flex items-center gap-3 text-xl uppercase">
        <span class="w-6 h-6 rounded-full border-base-content border-[5px] transition-colors ease-in-out {persona === key ? 'bg-base-content' : ''}"></span>
        <img class="w-[27px] h-auto" src={`${window.location.origin}/${key}.png`} alt={key} />
        <span class="font-bold capitalize">{key}</span>
      </div>
      <p class="text-base text-left">
        {personas[key]}
      </p>
    </button>
  {/each}
</div>

<button disabled={!personaSelected} on:click={handleButtonClick} class="btn btn-primary btn-lg w-full mb-4 text-lg uppercase rounded-none">
  Get at it
</button>
