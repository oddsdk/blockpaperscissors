<script lang="ts">
  import { page } from '$app/stores'

  const links = [
    { label: 'play', url: `${$page?.params?.team}/play`, }, { label: 'monitor', url: `${$page?.params?.team}/monitor`, }, { label: 'leaderboard', url: `${$page?.params?.team}/leaderboard`, }, { label: 'help', url: `${$page?.params?.team}/help` }, { label: 'profile', url: `${$page?.params?.team}/profile` }
  ]
</script>

<div class="fixed bottom-0 right-0 left-0 z-20 flex items-center justify-between divide-x divide-base-100 border border-base-100">
  {#each links as link, i}
    <a href={`/${link.url}`} class="flex items-center justify-center grow h-16 bg-base-content transition-colors ease-in-out hover:bg-base-100 {$page.route.id.includes(link.label) ? 'bg-base-100' : ''}">
      <img class="w-[27px] h-auto" src={`${window.location.origin}/${link.label}.svg`} alt={link.label} />
    </a>
  {/each}
</div>
