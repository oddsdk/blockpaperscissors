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

<div class="flex flex-col gap-8 py-8">
  <label class="flex flex-col gap-4" for="builder">
    <h3 class="flex items-center space-x-4 text-xl uppercase">
      <input name="style" id="builder" value="builder" type="radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/> 
      <img class="w-[27px] h-auto" src={`${window.location.origin}/builder.png`} alt="Builder" /> 
      <span>Builder</span>
    </h3>
    <p class="text-base">
      I’d like to see everyone work together for a greater outcome.
    </p>
  </label>

  <label class="flex flex-col gap-4" for="speculator">
    <h3 class="flex items-center space-x-4 text-xl uppercase">
      <input name="style" id="speculator" value="speculator" type="radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/> 
      <img class="w-[27px] h-auto" src={`${window.location.origin}/speculator.png`} alt="Speculator" /> 
      <span>Speculator</span>
    </h3>
    <p class="text-base">
      I’ll happily ride the current trend for personal gain.
    </p>
  </label>

  <label class="flex flex-col gap-4" for="artist">
    <h3 class="flex items-center space-x-4 text-xl uppercase">
      <input name="style" id="artist" value="artist" type="radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/> 
      <img class="w-[27px] h-auto" src={`${window.location.origin}/artist.png`} alt="Artist" />
      <span>Artist</span>
    </h3>
    <p class="text-base">
      Few understand that the network is a blank canvas.
    </p>
  </label>
</div>

<a class="btn btn-primary btn-lg w-full mb-4 text-lg uppercase rounded-none" href="/style">
  Get at it
</a>
