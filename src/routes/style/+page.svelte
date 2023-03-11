<script lang="ts">
  import Divider from '$components/common/Divider.svelte'
</script>

<Divider align="right" size="small" />

<h1 class="text-3xl pt-8 pb-10">
  WHAT'S<br/>
  YOUR<br/>
  STYLE?
</h1>

<Divider size="medium" />

<h2 class="text-xl py-10 font-bold">
    This is a game of mass coordination
</h2>

<Divider />

<div class="flex flex-col gap-8 py-8">
  <div class="flex flex-col gap-4">
    <h3 class="flex items-center justify-between text-xl uppercase">Builder <img class="w-[27px] h-auto" src={`${window.location.origin}/builder.png`} alt="Builder" /></h3>
    <p class="text-base">
      I’d like to see everyone work together for a greater outcome.
    </p>
  </div>

  <div class="flex flex-col gap-4">
    <h3 class="flex items-center justify-between text-xl uppercase">Speculator <img class="w-[27px] h-auto" src={`${window.location.origin}/speculator.png`} alt="Speculator" /></h3>
    <p class="text-base">
      I’ll happily ride the current trend for personal gain.
    </p>
  </div>

  <div class="flex flex-col gap-4">
    <h3 class="flex items-center justify-between text-xl uppercase">Artist <img class="w-[27px] h-auto" src={`${window.location.origin}/artist.png`} alt="Artist" /></h3>
    <p class="text-base">
      Few understand that the network is a blank canvas.
    </p>
  </div>
</div>

<a class="btn btn-primary btn-lg w-full mb-4 text-lg uppercase rounded-none" href="/style">
  Get at it
</a>
