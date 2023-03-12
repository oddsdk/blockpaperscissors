<script lang="ts">
  import { page } from '$app/stores'
  // import { fly } from 'svelte/transition'

  const links = [
    'builder', 'speculator', 'artist', 'history'
  ]
</script>

<div class="flex items-center justify-between">
  {#each links as link, i}
  <!-- in:fly={{ y: 20, delay: 0+(i*20), duration: 300 }} -->
    <a href={`/${link}`} class="flex items-center justify-center w-[68px] h-16 bg-base-content transition-colors ease-in-out hover:bg-blue-500 {$page.route.id === `/${link}` ? 'bg-blue-500' : ''}">
      <img class="w-[27px] h-auto" src={`${window.location.origin}/${link}.png`} alt={link} />
    </a>
  {/each}
</div>
