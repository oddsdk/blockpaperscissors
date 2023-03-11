<script lang="ts">
  import { goto } from '$app/navigation'

  import Divider from '$components/common/Divider.svelte'

  let personaSelected = false
  let persona: string

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
  <button on:click={() => handlePersonaClick('builder')} class="flex flex-col gap-3">
    <div class="flex items-center gap-3 text-xl uppercase">
      <span class="w-6 h-6 rounded-full border-base-content border-[5px] transition-colors ease-in-out {persona === 'builder' ? 'bg-base-content' : ''}"></span>
      <img class="w-[27px] h-auto" src={`${window.location.origin}/builder.png`} alt="Builder" />
      <span class="font-bold">Builder</span>
    </div>
    <p class="text-base text-left">
      I’d like to see everyone work together for a greater outcome.
    </p>
  </button>

  <button on:click={() => handlePersonaClick('speculator')} class="flex flex-col gap-3">
    <div class="flex items-center gap-3 text-xl uppercase">
      <span class="w-6 h-6 rounded-full border-base-content border-[5px] transition-colors ease-in-out {persona === 'speculator' ? 'bg-base-content' : ''}"></span>
      <img class="w-[27px] h-auto" src={`${window.location.origin}/speculator.png`} alt="Speculator" />
      <span class="font-bold">Speculator</span>
    </div>
    <p class="text-base text-left">
      I’ll happily ride the current trend for personal gain.
    </p>
  </button>

  <button on:click={() => handlePersonaClick('artist')} class="flex flex-col gap-3">
    <div class="flex items-center gap-3 text-xl uppercase">
      <span class="w-6 h-6 rounded-full border-base-content border-[5px] transition-colors ease-in-out {persona === 'artist' ? 'bg-base-content' : ''}"></span>
      <img class="w-[27px] h-auto" src={`${window.location.origin}/artist.png`} alt="Artist" />
      <span class="font-bold">Artist</span>
    </div>
    <p class="text-base text-left">
      Few understand that the network is a blank canvas.
    </p>
  </button>
</div>

<button disabled={!personaSelected} on:click={handleButtonClick} class="btn btn-primary btn-lg w-full mb-4 text-lg uppercase rounded-none">
  Get at it
</button>
