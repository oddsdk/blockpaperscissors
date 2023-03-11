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
  <label class="flex flex-col gap-4" for="builder">
    <h3 class="flex items-center gap-3 text-xl uppercase">
      <button on:click={() => handlePersonaClick('builder')} class="w-6 h-6 rounded-full border-black-500 border-[5px] transition-colors ease-in-out {persona === 'builder' ? 'bg-black-500' : ''}"></button>
      <img class="w-[27px] h-auto" src={`${window.location.origin}/builder.png`} alt="Builder" />
      <span>Builder</span>
    </h3>
    <p class="text-base">
      I’d like to see everyone work together for a greater outcome.
    </p>
  </label>

  <label class="flex flex-col gap-4" for="speculator">
    <h3 class="flex items-center gap-3 text-xl uppercase">
      <button on:click={() => handlePersonaClick('speculator')} class="w-6 h-6 rounded-full border-black-500 border-[5px] transition-colors ease-in-out {persona === 'speculator' ? 'bg-black-500' : ''}"></button>
      <img class="w-[27px] h-auto" src={`${window.location.origin}/speculator.png`} alt="Speculator" />
      <span>Speculator</span>
    </h3>
    <p class="text-base">
      I’ll happily ride the current trend for personal gain.
    </p>
  </label>

  <label class="flex flex-col gap-4" for="artist">
    <h3 class="flex items-center gap-3 text-xl uppercase">
      <button on:click={() => handlePersonaClick('artist')} class="w-6 h-6 rounded-full border-black-500 border-[5px] transition-colors ease-in-out {persona === 'artist' ? 'bg-black-500' : ''}"></button>
      <img class="w-[27px] h-auto" src={`${window.location.origin}/artist.png`} alt="Artist" />
      <span>Artist</span>
    </h3>
    <p class="text-base">
      Few understand that the network is a blank canvas.
    </p>
  </label>
</div>

<button disabled={!personaSelected} on:click={handleButtonClick} class="btn btn-primary btn-lg w-full mb-4 text-lg uppercase rounded-none">
  Get at it
</button>
